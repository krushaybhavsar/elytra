import * as React from 'react';
import { Button, buttonVariants } from './button';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/tailwind';
import { LoaderCircle } from 'lucide-react';

interface LoadingButtonProps extends React.ComponentProps<'button'> {
  loading?: boolean;
  children: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: VariantProps<typeof buttonVariants>['size'];
  asChild?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, children, disabled, className, variant, size, asChild, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn('flex items-center', className)}
        variant={variant}
        size={size}
        asChild={asChild}
        {...props}
      >
        {loading && <LoaderCircle className={'animate-spin !duration-500 w-4 h-4'} />}
        {children}
      </Button>
    );
  },
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
