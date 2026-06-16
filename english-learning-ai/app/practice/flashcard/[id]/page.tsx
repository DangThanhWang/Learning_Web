"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { sessionStorage } from "@/lib/storage/session-storage"
import { LearningSession, FlashcardDifficulty } from "@/lib/types"
import { Flashcard } from "@/components/features/flashcard/flashcard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function FlashcardPracticePage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<LearningSession | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = params.id as string
    const loadedSession = sessionStorage.getSession(sessionId)

    if (!loadedSession) {
      alert("Không tìm thấy phiên học. Vui lòng phân tích văn bản mới.")
      router.push("/")
      return
    }

    if (loadedSession.vocabulary.length === 0) {
      alert("Không có từ vựng để học flashcard.")
      router.push(`/analysis/${sessionId}`)
      return
    }

    setSession(loadedSession)
    setLoading(false)

    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault()
        // Flip card logic is handled in Flashcard component
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [params.id, router])

  const handleReview = (difficulty: FlashcardDifficulty) => {
    if (!session) return

    // Update progress
    const updatedSession = { ...session }
    updatedSession.progress.flashcard_reviews += 1

    const vocabId = session.vocabulary[currentIndex].id
    if (!updatedSession.progress.vocabulary_studied.includes(vocabId)) {
      updatedSession.progress.vocabulary_studied.push(vocabId)
    }

    if (difficulty === "easy") {
      if (!updatedSession.progress.vocabulary_mastered.includes(vocabId)) {
        updatedSession.progress.vocabulary_mastered.push(vocabId)
      }
    }

    sessionStorage.saveSession(updatedSession)
    setSession(updatedSession)

    // Move to next card
    if (currentIndex < session.vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsCompleted(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/analysis/${session.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại phân tích
            </Link>
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎴 Flashcard Practice
            </h1>
            <p className="text-gray-600">
              Học từ vựng hiệu quả với flashcard
            </p>
          </div>
        </div>

        {/* Flashcard or Completion */}
        {!isCompleted ? (
          <Flashcard
            vocabulary={session.vocabulary[currentIndex]}
            onReview={handleReview}
            currentIndex={currentIndex}
            totalCards={session.vocabulary.length}
          />
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="py-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Hoàn thành! 🎉
                </h2>
                <p className="text-gray-600 mb-6">
                  Bạn đã học xong {session.vocabulary.length} từ vựng
                </p>

                {/* Statistics */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6 inline-block">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      ✅ Đã học:{" "}
                      <span className="font-semibold">
                        {session.progress.vocabulary_studied.length}/
                        {session.vocabulary.length}
                      </span>
                    </p>
                    <p>
                      🌟 Đã thành thạo:{" "}
                      <span className="font-semibold">
                        {session.progress.vocabulary_mastered.length}/
                        {session.vocabulary.length}
                      </span>
                    </p>
                    <p>
                      🔄 Số lần ôn:{" "}
                      <span className="font-semibold">
                        {session.progress.flashcard_reviews}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleRestart}
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Học lại
                  </Button>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                    asChild
                  >
                    <Link href={`/analysis/${session.id}`}>
                      Xem phân tích
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
