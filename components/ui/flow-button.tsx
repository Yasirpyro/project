import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type FlowButtonProps = {
  href: string;
  text: string;
  variant?: 'primary' | 'secondary';
  className?: string;
};

const variantStyles = {
  primary: {
    container: 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40',
    text: 'text-white group-hover:text-white',
    circle: 'bg-blue-500/90',
    arrow: 'stroke-white',
  },
  secondary: {
    container: 'bg-white border-gray-300 text-gray-900 dark:bg-transparent dark:text-gray-100 dark:border-white/30',
    text: 'text-gray-900 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-gray-100',
    circle: 'bg-white/90 dark:bg-gray-100/10',
    arrow: 'stroke-gray-900 dark:stroke-gray-100',
  },
};

export function FlowButton({ href, text, variant = 'primary', className }: FlowButtonProps) {
  const palette = variantStyles[variant];

  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-flex items-center justify-center gap-1 overflow-hidden rounded-[999px] border-[1.5px] px-8 py-3 text-base font-semibold transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
        palette.container,
        className
      )}
    >
      <ArrowRight
        className={cn(
          'pointer-events-none absolute left-[-25%] h-4 w-4 z-[2] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4',
          palette.arrow
        )}
      />

      <span className={cn('relative z-[3] -translate-x-3 transition-transform duration-[800ms] ease-out group-hover:translate-x-3', palette.text)}>
        {text}
      </span>

      <span
        className={cn(
          'pointer-events-none absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[240px] group-hover:w-[240px] group-hover:opacity-100',
          palette.circle
        )}
      />

      <ArrowRight
        className={cn(
          'pointer-events-none absolute right-4 h-4 w-4 z-[2] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%]',
          palette.arrow
        )}
      />
    </Link>
  );
}
