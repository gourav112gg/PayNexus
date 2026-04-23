import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-input text-foreground h-[48px] w-full min-w-0 rounded-full border-0 px-[24px] py-[12px] text-base transition-all duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'shadow-[gray_0px_0px_0px_1px_inset]',
        'focus-visible:shadow-[var(--ring)_0px_0px_0px_2px_inset]',
        'aria-invalid:shadow-[var(--destructive)_0px_0px_0px_2px_inset]',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
