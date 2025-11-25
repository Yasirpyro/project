'use client'

import { cn } from '@/lib/utils'

type GlowTextProps = {
  text: string
  className?: string
  stagger?: number
}

export function GlowText({ text, className, stagger = 0.04 }: GlowTextProps) {
  return (
    <p className={cn('glow-text', className)}>
      {text.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="glow-letter"
          style={{ animationDelay: `${index * stagger}s` }}
        >
          {char}
        </span>
      ))}
    </p>
  )
}
