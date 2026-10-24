import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-on-primary shadow-sm hover:opacity-95 hover:shadow-md",
        destructive:
          "bg-error text-on-error shadow-sm hover:opacity-90",
        outline:
          "border border-outline-variant bg-transparent hover:bg-surface-container-high text-on-surface",
        secondary:
          "bg-secondary text-on-secondary shadow-sm hover:opacity-95",
        ghost:
          "hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface",
        link:
          "text-primary underline-offset-4 hover:underline",
        glass:
          "bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-low border border-white/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6",
        icon: "h-9 w-9 rounded-lg",
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
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
