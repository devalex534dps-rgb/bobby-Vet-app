import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-on-primary",
        secondary:
          "border-transparent bg-secondary-fixed text-on-secondary-fixed-variant",
        success:
          "border-transparent bg-status-success/15 text-status-success",
        warning:
          "border-transparent bg-status-warning/15 text-status-warning",
        danger:
          "border-transparent bg-status-danger/15 text-status-danger",
        outline:
          "text-on-surface border border-outline-variant",
        subtle:
          "border-transparent bg-surface-container-high text-on-surface-variant",
        ice:
          "border-transparent bg-surface-ice text-primary",
        primarySubtle:
          "border-transparent bg-primary-fixed text-on-primary-fixed-variant",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
