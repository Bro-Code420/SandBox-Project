"use client"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "motion/react"

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  suffix = "",
  stiffness = 100,
  damping = 60,
  className,
}: {
  value: number
  direction?: "up" | "down"
  delay?: number
  suffix?: string
  stiffness?: number
  damping?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : 0)
  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    if (isInView) {
      if (value > 150) {
        // Multi-stage animation: 1-10 then fast to target
        setTimeout(() => {
          motionValue.set(10)
          setTimeout(() => {
            motionValue.set(value)
          }, 600)
        }, delay * 1000)
      } else {
        setTimeout(() => {
          motionValue.set(direction === "down" ? 0 : value)
        }, delay * 1000)
      }
    }
  }, [motionValue, isInView, delay, value, direction])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = 
            Intl.NumberFormat("en-US").format(Math.round(latest)) + suffix
        }
      }),
    [springValue, suffix]
  )

  return (
    <span
      className={className}
      ref={ref}
    >
      0
    </span>
  )
}
