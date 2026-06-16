/**
 * Core type definitions for English Learning AI
 * Designed for scalability and future feature extensions
 */

// ============================================
// Vocabulary Types
// ============================================

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type WordType =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'pronoun'
  | 'interjection'
  | 'phrasal verb'
  | 'idiom';

export interface VocabularyItem {
  id: string;
  word: string;
  type: WordType;
  level: CEFRLevel;
  definition_vi: string;
  definition_en: string;
  phonetic?: string;
  examples: string[];
  synonyms?: string[];
  antonyms?: string[];
  context_in_text: string;
  imageUrl?: string; // For future feature: visual learning
  audioUrl?: string; // For future feature: pronunciation
  frequency?: number; // How common the word is
  tags?: string[]; // For categorization (business, academic, etc.)
}

// ============================================
// Grammar Types
// ============================================

export type GrammarCategory =
  | 'tenses'
  | 'passive-voice'
  | 'conditionals'
  | 'relative-clauses'
  | 'modal-verbs'
  | 'reported-speech'
  | 'gerunds-infinitives'
  | 'articles'
  | 'prepositions'
  | 'conjunctions'
  | 'sentence-structure';

export interface GrammarPoint {
  id: string;
  structure: string;
  category: GrammarCategory;
  level: CEFRLevel;
  example_from_text: string;
  explanation_vi: string;
  explanation_en: string;
  formula?: string;
  more_examples: string[];
  common_mistakes: string[];
  tips?: string[];
  relatedTopics?: string[]; // For future feature: grammar tree navigation
}

// ============================================
// Exercise/Practice Types
// ============================================

export type ExerciseType =
  | 'fill-blank'
  | 'multiple-choice'
  | 'matching'
  | 'translation'
  | 'sentence-building'
  | 'error-correction';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correct_answer: string | string[];
  explanation: string;
  difficulty: CEFRLevel;
  relatedVocabularyIds?: string[];
  relatedGrammarIds?: string[];
}

// ============================================
// Learning Session Types
// ============================================

export interface LearningSession {
  id: string;
  created_at: Date;
  updated_at: Date;
  title?: string; // User can name their session
  original_text: string;
  word_count: number;
  vocabulary: VocabularyItem[];
  grammar: GrammarPoint[];
  exercises?: Exercise[];

  // Progress tracking
  progress: {
    vocabulary_studied: string[]; // IDs of studied words
    vocabulary_mastered: string[]; // IDs of mastered words
    flashcard_reviews: number;
    quiz_attempts: number;
    quiz_score?: number;
    time_spent_minutes: number;
  };

  // Future features
  tags?: string[]; // User-defined tags for organization
  source?: string; // Where the text came from (article URL, book, etc.)
  notes?: string; // User notes
  isFavorite?: boolean;
}

// ============================================
// Flashcard Types
// ============================================

export type FlashcardDifficulty = 'hard' | 'good' | 'easy';

export interface FlashcardReview {
  vocabularyId: string;
  timestamp: Date;
  difficulty: FlashcardDifficulty;
  timeSpentSeconds: number;
}

export interface FlashcardProgress {
  vocabularyId: string;
  reviews: FlashcardReview[];
  nextReviewDate: Date; // For spaced repetition (future feature)
  interval: number; // Days until next review
  easeFactor: number; // For SM-2 algorithm (future feature)
}

// ============================================
// User Statistics Types (for future features)
// ============================================

export interface UserStats {
  total_words_learned: number;
  total_sessions: number;
  total_study_time_minutes: number;
  streak_days: number;
  last_study_date?: Date;
  vocabulary_by_level: Record<CEFRLevel, number>;
  vocabulary_by_type: Record<WordType, number>;
  favorite_words: string[]; // vocabulary IDs
  weakWords: string[]; // Words that need more practice
  achievements?: Achievement[]; // For gamification
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number; // 0-100
  target: number;
}

// ============================================
// AI Response Types
// ============================================

export interface AIAnalysisResponse {
  vocabulary: VocabularyItem[];
  grammar: GrammarPoint[];
  summary?: {
    total_words: number;
    unique_words: number;
    difficulty_level: CEFRLevel;
    estimated_reading_time_minutes: number;
  };
}

export interface AIExerciseResponse {
  exercises: Exercise[];
}

// ============================================
// Storage/Database Types
// ============================================

export interface StorageData {
  sessions: LearningSession[];
  user_stats: UserStats;
  flashcard_progress: FlashcardProgress[];
  settings: AppSettings;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'vi';
  showPhonetics: boolean;
  autoPlayAudio: boolean;
  dailyGoal: number; // words per day
  notifications: boolean;
  // Future settings
  spaced_repetition_enabled: boolean;
  difficulty_filter: CEFRLevel[];
}

// ============================================
// API Types
// ============================================

export interface AnalyzeTextRequest {
  text: string;
  options?: {
    extract_vocabulary?: boolean;
    extract_grammar?: boolean;
    generate_exercises?: boolean;
    target_level?: CEFRLevel;
  };
}

export interface AnalyzeTextResponse {
  sessionId: string;
  analysis: AIAnalysisResponse;
  exercises?: Exercise[];
}

// ============================================
// Component Props Types (examples)
// ============================================

export interface VocabularyCardProps {
  vocabulary: VocabularyItem;
  onAddToStudy?: (id: string) => void;
  onMarkMastered?: (id: string) => void;
  showActions?: boolean;
}

export interface FlashcardProps {
  vocabulary: VocabularyItem;
  onReview: (difficulty: FlashcardDifficulty) => void;
  showProgress?: boolean;
}

export interface GrammarCardProps {
  grammar: GrammarPoint;
  isExpanded?: boolean;
  onToggle?: () => void;
}
