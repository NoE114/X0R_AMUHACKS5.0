import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const Avatar = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-transparent bg-linear-to-br from-primary/20 via-primary/10 to-transparent shadow-sm shadow-primary/30',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

Avatar.displayName = 'Avatar';

const AvatarImage = React.forwardRef(({ className, src, alt = 'User avatar', ...props }, ref) => (
  <Image
    ref={ref}
    src={src}
    alt={alt}
    className={cn('object-cover h-full w-full', className)}
    fill
    sizes="40px"
    {...props}
  />
));

AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef(({ children, className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center bg-linear-to-br from-primary to-primary/50 font-semibold uppercase tracking-widest text-primary-foreground',
      className
    )}
    {...props}
  >
    {children}
  </span>
));

AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
