import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FC,
} from "react"

import { cn } from "@/lib/utils"

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md",

        // Shine effect
        "animate-shiny-text bg-clip-text text-transparent bg-[length:var(--shiny-width)_100%] bg-[position:0_0] bg-no-repeat transition-all duration-1000",

        // Shine gradient - uses currentcolor for base so it's always visible
        "bg-linear-to-r from-primary/80 via-white to-primary/80 dark:from-primary/40 dark:via-white dark:to-primary/40",

        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
