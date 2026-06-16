/**
 * LocalStorage service for managing learning sessions
 * Designed to be easily replaceable with IndexedDB or backend API in the future
 */

import type {
  LearningSession,
  UserStats,
  FlashcardProgress,
  AppSettings,
  StorageData,
} from "../types"

const STORAGE_KEYS = {
  SESSIONS: "english-learning-sessions",
  USER_STATS: "english-learning-stats",
  FLASHCARD_PROGRESS: "english-learning-flashcards",
  SETTINGS: "english-learning-settings",
} as const

// ============================================
// Helper Functions
// ============================================

function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return defaultValue
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error)
  }
}

// ============================================
// Session Management
// ============================================

export const sessionStorage = {
  /**
   * Get all learning sessions
   */
  getAllSessions(): LearningSession[] {
    return safeGetItem<LearningSession[]>(STORAGE_KEYS.SESSIONS, [])
  },

  /**
   * Get a specific session by ID
   */
  getSession(id: string): LearningSession | null {
    const sessions = this.getAllSessions()
    return sessions.find((s) => s.id === id) || null
  },

  /**
   * Save a new session or update existing one
   */
  saveSession(session: LearningSession): void {
    const sessions = this.getAllSessions()
    const existingIndex = sessions.findIndex((s) => s.id === session.id)

    if (existingIndex >= 0) {
      sessions[existingIndex] = {
        ...session,
        updated_at: new Date(),
      }
    } else {
      sessions.unshift(session) // Add to beginning
    }

    safeSetItem(STORAGE_KEYS.SESSIONS, sessions)
  },

  /**
   * Delete a session
   */
  deleteSession(id: string): void {
    const sessions = this.getAllSessions()
    const filtered = sessions.filter((s) => s.id !== id)
    safeSetItem(STORAGE_KEYS.SESSIONS, filtered)
  },

  /**
   * Update session progress
   */
  updateSessionProgress(
    id: string,
    progress: Partial<LearningSession["progress"]>
  ): void {
    const session = this.getSession(id)
    if (!session) return

    session.progress = {
      ...session.progress,
      ...progress,
    }
    session.updated_at = new Date()

    this.saveSession(session)
  },

  /**
   * Get recent sessions (limit)
   */
  getRecentSessions(limit: number = 10): LearningSession[] {
    const sessions = this.getAllSessions()
    return sessions
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit)
  },

  /**
   * Search sessions by text content
   */
  searchSessions(query: string): LearningSession[] {
    const sessions = this.getAllSessions()
    const lowerQuery = query.toLowerCase()

    return sessions.filter(
      (s) =>
        s.original_text.toLowerCase().includes(lowerQuery) ||
        s.title?.toLowerCase().includes(lowerQuery) ||
        s.vocabulary.some((v) => v.word.toLowerCase().includes(lowerQuery))
    )
  },
}

// ============================================
// User Statistics Management
// ============================================

const DEFAULT_STATS: UserStats = {
  total_words_learned: 0,
  total_sessions: 0,
  total_study_time_minutes: 0,
  streak_days: 0,
  vocabulary_by_level: {
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
    C1: 0,
    C2: 0,
  },
  vocabulary_by_type: {
    noun: 0,
    verb: 0,
    adjective: 0,
    adverb: 0,
    preposition: 0,
    conjunction: 0,
    pronoun: 0,
    interjection: 0,
    "phrasal verb": 0,
    idiom: 0,
  },
  favorite_words: [],
  weakWords: [],
}

export const userStatsStorage = {
  /**
   * Get user statistics
   */
  getStats(): UserStats {
    return safeGetItem<UserStats>(STORAGE_KEYS.USER_STATS, DEFAULT_STATS)
  },

  /**
   * Update user statistics
   */
  updateStats(stats: Partial<UserStats>): void {
    const currentStats = this.getStats()
    const updatedStats = { ...currentStats, ...stats }
    safeSetItem(STORAGE_KEYS.USER_STATS, updatedStats)
  },

  /**
   * Increment word learned count
   */
  incrementWordsLearned(count: number = 1): void {
    const stats = this.getStats()
    stats.total_words_learned += count
    safeSetItem(STORAGE_KEYS.USER_STATS, stats)
  },

  /**
   * Increment session count
   */
  incrementSessions(): void {
    const stats = this.getStats()
    stats.total_sessions += 1
    safeSetItem(STORAGE_KEYS.USER_STATS, stats)
  },

  /**
   * Add study time
   */
  addStudyTime(minutes: number): void {
    const stats = this.getStats()
    stats.total_study_time_minutes += minutes
    safeSetItem(STORAGE_KEYS.USER_STATS, stats)
  },

  /**
   * Reset all statistics
   */
  resetStats(): void {
    safeSetItem(STORAGE_KEYS.USER_STATS, DEFAULT_STATS)
  },
}

// ============================================
// Flashcard Progress Management
// ============================================

export const flashcardStorage = {
  /**
   * Get all flashcard progress
   */
  getAllProgress(): FlashcardProgress[] {
    return safeGetItem<FlashcardProgress[]>(STORAGE_KEYS.FLASHCARD_PROGRESS, [])
  },

  /**
   * Get progress for a specific vocabulary item
   */
  getProgress(vocabularyId: string): FlashcardProgress | null {
    const allProgress = this.getAllProgress()
    return allProgress.find((p) => p.vocabularyId === vocabularyId) || null
  },

  /**
   * Save flashcard review
   */
  saveReview(review: FlashcardProgress): void {
    const allProgress = this.getAllProgress()
    const existingIndex = allProgress.findIndex(
      (p) => p.vocabularyId === review.vocabularyId
    )

    if (existingIndex >= 0) {
      allProgress[existingIndex] = review
    } else {
      allProgress.push(review)
    }

    safeSetItem(STORAGE_KEYS.FLASHCARD_PROGRESS, allProgress)
  },

  /**
   * Get due flashcards (for spaced repetition)
   */
  getDueFlashcards(): FlashcardProgress[] {
    const allProgress = this.getAllProgress()
    const now = new Date()

    return allProgress.filter((p) => new Date(p.nextReviewDate) <= now)
  },
}

// ============================================
// Settings Management
// ============================================

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  language: "vi",
  showPhonetics: true,
  autoPlayAudio: false,
  dailyGoal: 20,
  notifications: false,
  spaced_repetition_enabled: false,
  difficulty_filter: ["A1", "A2", "B1", "B2", "C1", "C2"],
}

export const settingsStorage = {
  /**
   * Get app settings
   */
  getSettings(): AppSettings {
    return safeGetItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  },

  /**
   * Update app settings
   */
  updateSettings(settings: Partial<AppSettings>): void {
    const currentSettings = this.getSettings()
    const updatedSettings = { ...currentSettings, ...settings }
    safeSetItem(STORAGE_KEYS.SETTINGS, updatedSettings)
  },

  /**
   * Reset settings to default
   */
  resetSettings(): void {
    safeSetItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  },
}

// ============================================
// Bulk Operations
// ============================================

export const storageManager = {
  /**
   * Export all data
   */
  exportAllData(): StorageData {
    return {
      sessions: sessionStorage.getAllSessions(),
      user_stats: userStatsStorage.getStats(),
      flashcard_progress: flashcardStorage.getAllProgress(),
      settings: settingsStorage.getSettings(),
    }
  },

  /**
   * Import all data
   */
  importAllData(data: StorageData): void {
    safeSetItem(STORAGE_KEYS.SESSIONS, data.sessions)
    safeSetItem(STORAGE_KEYS.USER_STATS, data.user_stats)
    safeSetItem(STORAGE_KEYS.FLASHCARD_PROGRESS, data.flashcard_progress)
    safeSetItem(STORAGE_KEYS.SETTINGS, data.settings)
  },

  /**
   * Clear all data
   */
  clearAllData(): void {
    if (typeof window === "undefined") return

    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  },

  /**
   * Get storage size (approximate)
   */
  getStorageSize(): number {
    if (typeof window === "undefined") return 0

    let total = 0
    Object.values(STORAGE_KEYS).forEach((key) => {
      const item = localStorage.getItem(key)
      if (item) {
        total += item.length
      }
    })
    return total
  },
}
