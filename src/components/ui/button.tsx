import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "glass-button text-[var(--button-text-color)] shadow-lg hover:shadow-xl",
        destructive:
          "bg-gradient-to-r from-destructive to-red-500 text-[var(--button-text-color)] hover:from-destructive/90 hover:to-red-500/90 shadow-lg hover:shadow-xl",
        outline:
          "glass-button border border-border/50 bg-background/50 backdrop-blur-md hover:bg-accent/20 text-[var(--button-text-color)] hover:border-accent/50",
        secondary:
          "glass-button text-[var(--button-text-color)] shadow-lg hover:shadow-xl",
        ghost: "glass-button hover:bg-accent/20 text-[var(--button-text-color)] backdrop-blur-sm",
        link: "text-[var(--button-text-color)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
