import User from '../models/User.js';
import Decision from '../models/Decision.js';
import Feedback from '../models/Feedback.js';
import { connectDB } from './mongodb.js';
import {
  getAISuggestion,
  getFallbackOptions
} from './ai-proxy.js';
import {
  calculateConfidence,
  updatePreferences,
  getTopOptions
} from '../utils/learning.js';

export async function getRecommendation(userId, type, context, question) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const preferences = user.preferences || { meal: {}, task: {}, clothing: {} };
  if (!preferences.clothing) preferences.clothing = {};
  if (!preferences.meal) preferences.meal = {};
  if (!preferences.task) preferences.task = {};

  // Build user data for AI context from onboarding
  const userData = {
    profile: user.profile || null,
    health: user.health || null,
    work: user.work || null,
    foodPreferences: user.foodPreferences || null,
    clothingPreferences: user.clothingPreferences || null,
    taskStyle: user.taskStyle || null,
    decisionStyle: user.decisionStyle || null,
  };

  const recentDecisions = await Decision.find({ userId, type })
    .sort({ createdAt: -1 })
    .limit(7)
    .lean();
  const recentOptions = recentDecisions.flatMap((decision) => decision.options || []);
  const recentChosen = recentDecisions.map((decision) => decision.chosenOption).filter(Boolean);
  const recentSuggestions = Array.from(new Set([...recentChosen, ...recentOptions])).slice(0, 12);

  // Get AI suggestion - let errors propagate for proper user feedback
  const aiSuggestionData = await getAISuggestion(
    userId,
    type,
    context,
    preferences[type] || {},
    user.preferredProvider,
    userData,
    recentSuggestions
  );

  const fallbackOptions = getFallbackOptions(type);
  const userTopOptions = getTopOptions(preferences, type, 4);

  const recentlyChosenHigh = recentDecisions
    .filter((decision) => decision.rating >= 4 && decision.chosenOption)
    .map((decision) => decision.chosenOption);
  const allowRepeat = recentlyChosenHigh.length ? recentlyChosenHigh[0] : null;

  const normalize = (value) => value?.toLowerCase?.().trim();
  const isRecent = (value) => recentOptions.some((opt) => normalize(opt) === normalize(value));

  const optionsSet = new Set();
  const addOption = (value) => {
    if (!value) return;
    if (optionsSet.has(value)) return;
    if (isRecent(value) && value !== allowRepeat) return;
    optionsSet.add(value);
  };

  addOption(aiSuggestionData?.suggestion);
  userTopOptions.forEach(addOption);

  for (const opt of fallbackOptions) {
    if (optionsSet.size >= 4) break;
    addOption(opt);
  }

  // Ensure we always return 4 options
  for (const opt of fallbackOptions) {
    if (optionsSet.size >= 4) break;
    optionsSet.add(opt);
  }

  const options = Array.from(optionsSet).slice(0, 4);

  // Calculate confidence
  const primaryOption = options[0];
  const confidence = calculateConfidence(preferences, primaryOption, type);

  const decisionQuestion = question?.trim() || (
    type === 'meal' ? 'What should I eat today?' :
    type === 'clothing' ? 'What should I wear today?' :
    'What should I do today?'
  );
  const provider = aiSuggestionData?.provider || 'fallback';

  const decision = new Decision({
    userId,
    type,
    context,
    options,
    aiSuggestion: aiSuggestionData?.suggestion || null,
    confidence,
    question: decisionQuestion,
    providerUsed: provider
  });

  await decision.save();

  return {
    decisionId: decision._id.toString(),
    options,
    aiSuggestion: aiSuggestionData?.suggestion || null,
    confidence,
    type,
    question: decisionQuestion,
    providerUsed: provider
  };
}

export async function recordFeedback(userId, decisionId, chosenOption, rating) {
  await connectDB();

  const decision = await Decision.findOne({ _id: decisionId, userId });
  if (!decision) {
    throw new Error('Decision not found');
  }

  if (!decision.options.includes(chosenOption)) {
    throw new Error('Invalid option selected');
  }

  const feedback = new Feedback({
    decisionId,
    chosenOption,
    rating,
    userId,
    type: decision.type
  });

  await feedback.save();

  decision.chosenOption = chosenOption;
  decision.rating = rating;
  await decision.save();

  const user = await User.findById(userId);
  const currentPrefs = user.preferences || { meal: {}, task: {}, clothing: {} };
  if (!currentPrefs.clothing) currentPrefs.clothing = {};

  const updatedPreferences = updatePreferences(
    currentPrefs,
    decision.type,
    chosenOption,
    rating
  );

  user.preferences = updatedPreferences;
  user.markModified('preferences');
  await user.save();

  return {
    success: true,
    updatedPreferences: updatedPreferences[decision.type]
  };
}

export async function getUserStats(userId) {
  await connectDB();

  const totalDecisions = await Decision.countDocuments({ userId });
  const totalFeedback = await Feedback.countDocuments({ userId });

  const avgRatingResult = await Feedback.aggregate([
    { $match: { userId } },
    { $group: { _id: null, avg: { $avg: '$rating' } } }
  ]);

  const user = await User.findById(userId);
  const prefs = user?.preferences || {};

  return {
    totalDecisions,
    totalFeedback,
    averageRating: avgRatingResult[0]?.avg || 0,
    topPreferences: {
      meal: getTopOptions(prefs, 'meal', 3),
      task: getTopOptions(prefs, 'task', 3),
      clothing: getTopOptions(prefs, 'clothing', 3)
    }
  };
}

export async function getUserHistory(userId, limit = 10) {
  await connectDB();
  const user = await User.findById(userId);
  const userPrefs = user?.preferences || {};
  const history = await Decision.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const decisionIds = history.map((decision) => decision._id.toString());
  const feedbacks = await Feedback.find({ userId, decisionId: { $in: decisionIds } })
    .sort({ createdAt: -1 })
    .lean();
  const feedbackByDecision = feedbacks.reduce((acc, feedback) => {
    if (!acc[feedback.decisionId]) {
      acc[feedback.decisionId] = feedback;
    }
    return acc;
  }, {});

  return history.map((decision) => {
    const decisionId = decision._id.toString();
    const feedback = feedbackByDecision[decisionId];
    const chosenOption = decision.chosenOption || feedback?.chosenOption || null;
    const rating = decision.rating || feedback?.rating || null;
    const confidenceTarget = chosenOption || decision.options?.[0] || decision.aiSuggestion;
    const confidence = calculateConfidence(userPrefs, confidenceTarget, decision.type);

    return {
      decisionId,
      type: decision.type,
      question: decision.question,
      aiSuggestion: decision.aiSuggestion,
      options: decision.options,
      confidence,
      providerUsed: decision.providerUsed,
      chosenOption,
      rating,
      createdAt: decision.createdAt
    };
  });
}
