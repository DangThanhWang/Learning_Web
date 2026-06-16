"use client"

import { VocabularyItem, FlashcardDifficulty } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2 } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { getLevelColor } from "@/lib/utils"

interface FlashcardProps {
  vocabulary: VocabularyItem
  onReview: (difficulty: FlashcardDifficulty) => void
  currentIndex: number
  totalCards: number
}

export function Flashcard({
  vocabulary,
  onReview,
  currentIndex,
  totalCards,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const speakWord = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(vocabulary.word)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleDifficulty = (difficulty: FlashcardDifficulty) => {
    setIsFlipped(false)
    setTimeout(() => {
      onReview(difficulty)
    }, 300)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600">
          Thẻ {currentIndex + 1} / {totalCards}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <motion.div
        className="relative"
        style={{ perspective: 1000 }}
        initial={false}
      >
        <motion.div
          className="relative w-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front side */}
          <Card
            className="w-full h-[400px] cursor-pointer flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 hover:border-blue-300 transition-colors"
            style={{
              backfaceVisibility: "hidden",
            }}
            onClick={() => setIsFlipped(true)}
          >
            <Badge variant="outline" className={`mb-6 ${getLevelColor(vocabulary.level)}`}>
              {vocabulary.level}
            </Badge>

            <h2 className="text-5xl font-bold text-blue-600 mb-4 text-center">
              {vocabulary.word}
            </h2>

            <Button
              variant="ghost"
              size="icon"
              className="mb-4"
              onClick={(e) => {
                e.stopPropagation()
                speakWord()
              }}
            >
              <Volume2 className="h-6 w-6 text-blue-600" />
            </Button>

            {vocabulary.phonetic && (
              <p className="text-lg text-gray-600 mb-4">{vocabulary.phonetic}</p>
            )}

            <Badge variant="secondary" className="mb-8">
              {vocabulary.type}
            </Badge>

            <p className="text-gray-500 text-sm animate-pulse">
              👆 Nhấn để lật thẻ
            </p>
          </Card>

          {/* Back side */}
          <Card
            className="absolute inset-0 w-full h-[400px] cursor-pointer flex flex-col p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            onClick={() => setIsFlipped(false)}
          >
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Definitions */}
              <div>
                <h3 className="text-xl font-bold text-purple-600 mb-2">
                  Định nghĩa:
                </h3>
                <p className="text-base text-gray-700 font-semibold">
                  🇻🇳 {vocabulary.definition_vi}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  🇬🇧 {vocabulary.definition_en}
                </p>
              </div>

              {/* Examples */}
              {vocabulary.examples && vocabulary.examples.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    💬 Ví dụ:
                  </h3>
                  {vocabulary.examples.slice(0, 2).map((example, idx) => (
                    <p key={idx} className="text-sm text-gray-600 italic mb-1">
                      • {example}
                    </p>
                  ))}
                </div>
              )}

              {/* Context */}
              {vocabulary.context_in_text && (
                <div className="bg-white/50 p-2 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Trong văn bản:</p>
                  <p className="text-sm text-gray-700 italic">
                    "{vocabulary.context_in_text}"
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-500 text-xs text-center mt-4">
              👆 Nhấn để lật lại
            </p>
          </Card>
        </motion.div>
      </motion.div>

      {/* Difficulty buttons */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex gap-3 justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            className="flex-1 max-w-[150px] border-red-200 hover:bg-red-50"
            onClick={() => handleDifficulty("hard")}
          >
            😰 Khó
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 max-w-[150px] border-yellow-200 hover:bg-yellow-50"
            onClick={() => handleDifficulty("good")}
          >
            😊 Được
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 max-w-[150px] border-green-200 hover:bg-green-50"
            onClick={() => handleDifficulty("easy")}
          >
            ✅ Dễ
          </Button>
        </motion.div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>⌨️ Phím tắt: Space = Lật thẻ</p>
      </div>
    </div>
  )
}
