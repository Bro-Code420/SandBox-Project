'use client'

import React from 'react'

export const IsometricBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.25] dark:opacity-[0.12]">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary/60"
      >
        <defs>
          <pattern
            id="isometric-pattern"
            width="120"
            height="104"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.2)"
          >
            {/* Isometric Cube Pattern */}
            <path
              d="M60 0 L120 34.6 L120 104 L60 138.6 L0 104 L0 34.6 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M60 0 L60 69.2 L120 104 M60 69.2 L0 104"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            {/* Sub-geometric details */}
            <path
              d="M30 17.3 L90 17.3 L120 34.6 L90 51.9 L30 51.9 L0 34.6 Z"
              fill="currentColor"
              fillOpacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#isometric-pattern)" />
      </svg>
      {/* Radial Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-background/50" />
    </div>
  )
}
