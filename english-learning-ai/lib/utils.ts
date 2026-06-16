import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type CEFRLevel } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get color class based on CEFR level
 */
export function getLevelColor(level: CEFRLevel): string {
  const colors: Record<CEFRLevel, string> = {
    A1: "bg-green-100 text-green-800 border-green-300",
    A2: "bg-blue-100 text-blue-800 border-blue-300",
    B1: "bg-yellow-100 text-yellow-800 border-yellow-300",
    B2: "bg-orange-100 text-orange-800 border-orange-300",
    C1: "bg-red-100 text-red-800 border-red-300",
    C2: "bg-purple-100 text-purple-800 border-purple-300",
  }
  return colors[level]
}

/**
 * Get level description
 */
export function getLevelDescription(level: CEFRLevel): string {
  const descriptions: Record<CEFRLevel, string> = {
    A1: "Beginner",
    A2: "Elementary",
    B1: "Intermediate",
    B2: "Upper Intermediate",
    C1: "Advanced",
    C2: "Proficiency",
  }
  return descriptions[level]
}

/**
 * Estimate reading time in minutes
 */
export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

  if (diffInSeconds < 60) return "vừa xong"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`

  return formatDate(date)
}

/**
 * Highlight words in text
 */
export function highlightWords(text: string, words: string[]): string {
  let highlighted = text
  words.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    highlighted = highlighted.replace(
      regex,
      `<mark class="bg-yellow-200 px-1 rounded">$&</mark>`
    )
  })
  return highlighted
}
