"use client"

import { useRouter } from "next/navigation"
import { TextAnalyzer } from "@/components/features/text-input/text-analyzer"
import { sessionStorage } from "@/lib/storage/session-storage"
import { LearningSession } from "@/lib/types"
import { countWords } from "@/lib/utils"
import { toast } from "sonner"

export default function Home() {
  const router = useRouter()

  const handleAnalyze = async (text: string) => {
    try {
      // Call API to analyze text
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Analysis failed")
      }

      const data = await response.json()

      // Create learning session
      const session: LearningSession = {
        id: data.sessionId,
        created_at: new Date(),
        updated_at: new Date(),
        original_text: text,
        word_count: countWords(text),
        vocabulary: data.analysis.vocabulary,
        grammar: data.analysis.grammar,
        progress: {
          vocabulary_studied: [],
          vocabulary_mastered: [],
          flashcard_reviews: 0,
          quiz_attempts: 0,
          time_spent_minutes: 0,
        },
      }

      // Save to localStorage
      sessionStorage.saveSession(session)

      // Navigate to analysis page
      router.push(`/analysis/${data.sessionId}`)
    } catch (error) {
      console.error("Analysis error:", error)
      alert(
        error instanceof Error
          ? error.message
          : "Phân tích thất bại. Vui lòng kiểm tra API key và thử lại."
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Học tiếng Anh thông minh với AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Paste bài văn tiếng Anh, AI sẽ phân tích từ vựng, ngữ pháp và tạo bài tập flashcard giúp bạn học hiệu quả hơn
          </p>
        </div>

        {/* Text analyzer */}
        <div className="max-w-4xl mx-auto">
          <TextAnalyzer onAnalyze={handleAnalyze} />
        </div>

        {/* Features */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Tính năng nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon="🤖"
              title="AI Thông minh"
              description="Sử dụng Google Gemini AI để phân tích chính xác"
            />
            <FeatureCard
              icon="📚"
              title="Từ vựng chi tiết"
              description="Định nghĩa, phiên âm, ví dụ và từ đồng nghĩa"
            />
            <FeatureCard
              icon="🎯"
              title="Ngữ pháp rõ ràng"
              description="Giải thích công thức, ví dụ và lỗi thường gặp"
            />
            <FeatureCard
              icon="🎴"
              title="Flashcard tương tác"
              description="Luyện tập với flashcard hiệu quả"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}
