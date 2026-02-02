import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getIconFallback(title: string): string {
  const chars = [...title]
  return chars.slice(0, 2).join('')
}
