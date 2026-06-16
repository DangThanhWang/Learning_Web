/**
 * Google Gemini AI Integration
 * Free tier: 15 requests/minute, 1500 requests/day
 */

import { GoogleGenerativeAI } from "@google/generative-ai"
import type {
  VocabularyItem,
  GrammarPoint,
  Exercise,
  AIAnalysisResponse,
  AIExerciseResponse,
} from "../types"
import { generateId } from "../utils"

// Initialize Gemini (API key will be set via environment variable)
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
)

// ============================================
// Prompts
// ============================================

const VOCABULARY_PROMPT = `Analyze this English text and extract vocabulary that a Vietnamese learner should study.

TEXT: {TEXT}

IMPORTANT: Return ONLY valid JSON, no additional text or markdown. Format:

{
  "vocabulary": [
    {
      "word": "accomplish",
      "type": "verb",
      "level": "B2",
      "definition_vi": "Đạt được, hoàn thành",
      "definition_en": "To succeed in doing something",
      "phonetic": "/əˈkʌmplɪʃ/",
      "examples": [
        "She accomplished all her goals this year.",
        "We need to accomplish this task by Friday."
      ],
      "synonyms": ["achieve", "complete", "fulfill"],
      "antonyms": ["fail", "abandon"],
      "context_in_text": "She has accomplished all her goals this year.",
      "frequency": 85
    }
  ]
}

Rules:
1. Only extract advanced vocabulary (B1-C2 level)
2. Skip basic words (A1-A2) like "the", "is", "and"
3. Include Vietnamese and English definitions
4. Provide 2-3 example sentences
5. Include IPA phonetic transcription
6. Add synonyms and antonyms if applicable
7. Include the original sentence from text as context
8. Frequency: 0-100 (how common the word is)
9. Maximum 30 words
10. Focus on: verbs, adjectives, nouns, phrasal verbs, idioms`

const GRAMMAR_PROMPT = `Analyze the grammar structures in this English text.

TEXT: {TEXT}

IMPORTANT: Return ONLY valid JSON, no additional text or markdown. Format:

{
  "grammar": [
    {
      "structure": "Present Perfect Tense",
      "category": "tenses",
      "level": "B1",
      "example_from_text": "She has accomplished all her goals",
      "explanation_vi": "Thì hiện tại hoàn thành diễn tả hành động đã hoàn thành nhưng có liên quan đến hiện tại hoặc kết quả còn ảnh hưởng đến hiện tại.",
      "explanation_en": "Present Perfect is used for actions completed in the past that have relevance to the present.",
      "formula": "have/has + past participle (V3)",
      "more_examples": [
        "I have finished my homework.",
        "They have lived here for 5 years.",
        "She hasn't seen that movie yet."
      ],
      "common_mistakes": [
        "Don't use with specific past time markers (yesterday, last week)",
        "Remember to use 'have' with I/you/we/they and 'has' with he/she/it"
      ],
      "tips": [
        "Use 'for' with duration: for 3 years",
        "Use 'since' with starting point: since 2020"
      ]
    }
  ]
}

Categories: tenses, passive-voice, conditionals, relative-clauses, modal-verbs, reported-speech, gerunds-infinitives, articles, prepositions, conjunctions, sentence-structure

Focus on:
1. Verb tenses and their usage
2. Passive voice structures
3. Conditional sentences
4. Modal verbs (can, should, must, etc.)
5. Relative clauses (who, which, that)
6. Complex sentence structures
7. Maximum 10 grammar points
8. Prioritize most important/difficult structures`

const EXERCISE_PROMPT = `Create practice exercises for these vocabulary words and grammar points.

VOCABULARY: {VOCABULARY}
GRAMMAR: {GRAMMAR}

IMPORTANT: Return ONLY valid JSON, no additional text or markdown. Format:

{
  "exercises": [
    {
      "type": "fill-blank",
      "question": "She has _______ all her goals this year.",
      "options": ["accomplish", "accomplished", "accomplishing", "accomplishes"],
      "correct_answer": "accomplished",
      "explanation": "Present Perfect requires the past participle form (have/has + V3).",
      "difficulty": "B2"
    },
    {
      "type": "multiple-choice",
      "question": "What does 'accomplish' mean?",
      "options": ["To fail", "To achieve successfully", "To try", "To forget"],
      "correct_answer": "To achieve successfully",
      "explanation": "Accomplish means to successfully complete or achieve something.",
      "difficulty": "B1"
    },
    {
      "type": "translation",
      "question": "Translate: 'Cô ấy đã đạt được tất cả mục tiêu của mình.'",
      "correct_answer": "She has accomplished all her goals.",
      "explanation": "Present Perfect tense with 'accomplished'",
      "difficulty": "B2"
    }
  ]
}

Exercise types: fill-blank, multiple-choice, translation, error-correction, sentence-building

Rules:
1. Create 10-15 exercises total
2. Mix different exercise types
3. Cover both vocabulary and grammar
4. Include clear explanations
5. Vary difficulty levels
6. Make questions practical and useful`

// ============================================
// AI Service Functions
// ============================================

export const geminiService = {
  /**
   * Analyze text and extract vocabulary
   */
  async analyzeVocabulary(text: string): Promise<VocabularyItem[]> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

      const prompt = VOCABULARY_PROMPT.replace("{TEXT}", text)
      const result = await model.generateContent(prompt)
      const response = result.response.text()

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from AI")
      }

      const parsed = JSON.parse(jsonMatch[0])

      // Add IDs to vocabulary items
      return parsed.vocabulary.map((item: Omit<VocabularyItem, "id">) => ({
        ...item,
        id: generateId(),
      }))
    } catch (error) {
      console.error("Error analyzing vocabulary:", error)
      throw new Error("Failed to analyze vocabulary. Please try again.")
    }
  },

  /**
   * Analyze text and extract grammar points
   */
  async analyzeGrammar(text: string): Promise<GrammarPoint[]> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

      const prompt = GRAMMAR_PROMPT.replace("{TEXT}", text)
      const result = await model.generateContent(prompt)
      const response = result.response.text()

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from AI")
      }

      const parsed = JSON.parse(jsonMatch[0])

      // Add IDs to grammar items
      return parsed.grammar.map((item: Omit<GrammarPoint, "id">) => ({
        ...item,
        id: generateId(),
      }))
    } catch (error) {
      console.error("Error analyzing grammar:", error)
      throw new Error("Failed to analyze grammar. Please try again.")
    }
  },

  /**
   * Generate exercises from vocabulary and grammar
   */
  async generateExercises(
    vocabulary: VocabularyItem[],
    grammar: GrammarPoint[]
  ): Promise<Exercise[]> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

      const vocabList = vocabulary.map((v) => v.word).join(", ")
      const grammarList = grammar.map((g) => g.structure).join(", ")

      const prompt = EXERCISE_PROMPT.replace("{VOCABULARY}", vocabList).replace(
        "{GRAMMAR}",
        grammarList
      )

      const result = await model.generateContent(prompt)
      const response = result.response.text()

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from AI")
      }

      const parsed = JSON.parse(jsonMatch[0])

      // Add IDs to exercises
      return parsed.exercises.map((item: Omit<Exercise, "id">) => ({
        ...item,
        id: generateId(),
      }))
    } catch (error) {
      console.error("Error generating exercises:", error)
      throw new Error("Failed to generate exercises. Please try again.")
    }
  },

  /**
   * Complete analysis (vocabulary + grammar)
   */
  async analyzeText(text: string): Promise<AIAnalysisResponse> {
    try {
      // Run vocabulary and grammar analysis in parallel
      const [vocabulary, grammar] = await Promise.all([
        this.analyzeVocabulary(text),
        this.analyzeGrammar(text),
      ])

      // Calculate summary
      const words = text.trim().split(/\s+/)
      const uniqueWords = new Set(words.map((w) => w.toLowerCase()))

      return {
        vocabulary,
        grammar,
        summary: {
          total_words: words.length,
          unique_words: uniqueWords.size,
          difficulty_level: this.estimateDifficulty(vocabulary),
          estimated_reading_time_minutes: Math.ceil(words.length / 200),
        },
      }
    } catch (error) {
      console.error("Error analyzing text:", error)
      throw error
    }
  },

  /**
   * Estimate overall difficulty level
   */
  estimateDifficulty(vocabulary: VocabularyItem[]): "A1" | "A2" | "B1" | "B2" | "C1" | "C2" {
    if (vocabulary.length === 0) return "A2"

    const levels = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 }
    const avgLevel =
      vocabulary.reduce((sum, v) => sum + levels[v.level], 0) / vocabulary.length

    if (avgLevel < 1.5) return "A1"
    if (avgLevel < 2.5) return "A2"
    if (avgLevel < 3.5) return "B1"
    if (avgLevel < 4.5) return "B2"
    if (avgLevel < 5.5) return "C1"
    return "C2"
  },
}

// ============================================
// Error Handling & Retry Logic
// ============================================

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError
}
