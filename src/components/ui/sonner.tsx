import * as React from 'react';
import { Toaster as Sonner, ToasterProps } from 'sonner';
import { useTheme } from 'next-themes';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      // theme={theme as ToasterProps['theme']}
      theme='light'
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-popover group-[.toaster]:popover-foreground group-[.toaster]:border-border group-[.toaster]:border-[1px] group-[.toaster]:shadow-sm group-[.toaster]:text-primary group-[.toaster]:text-normal ',
          description: 'group-[.toast]:text-muted-foreground',
          title: 'group-[.toast]:text-primary !group-[.toast]:text-normal',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
