import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'safe':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'at-risk':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'high-risk':
      return 'text-red-600 bg-red-50 border-red-200';
  }
}

export function getRiskLabel(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'safe':
      return 'Safe';
    case 'at-risk':
      return 'At Risk';
    case 'high-risk':
      return 'High Risk';
  }
}

export function getProficiencyColor(proficiency: string): string {
  switch (proficiency) {
    case 'Advanced':
      return 'bg-green-500 text-white';
    case 'Intermediate':
      return 'bg-blue-500 text-white';
    case 'Beginner':
      return 'bg-gray-400 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
