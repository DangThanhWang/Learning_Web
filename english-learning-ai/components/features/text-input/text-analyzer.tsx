"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, BookOpen } from "lucide-react"

interface TextAnalyzerProps {
  onAnalyze: (text: string) => Promise<void>
}

const SAMPLE_TEXT = `Climate change is one of the most significant challenges facing our planet today. Scientists have been studying this phenomenon for decades, and their findings are increasingly alarming. Rising global temperatures are causing glaciers to melt at an unprecedented rate, leading to rising sea levels that threaten coastal communities worldwide.

The primary cause of climate change is the emission of greenhouse gases, particularly carbon dioxide, which results from burning fossil fuels. These activities have intensified dramatically since the Industrial Revolution. As a consequence, we are witnessing more frequent and severe weather events, including hurricanes, droughts, and wildfires.

However, there is still hope. Many countries have committed to reducing their carbon footprint by investing in renewable energy sources such as solar and wind power. Additionally, individuals can make a difference by adopting sustainable practices in their daily lives, such as reducing waste, conserving energy, and supporting environmentally friendly products.`

export function TextAnalyzer({ onAnalyze }: TextAnalyzerProps) {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim() || text.trim().split(/\s+/).length < 10) {
      alert("Vui lòng nhập ít nhất 10 từ để phân tích!")
      return
    }

    setIsAnalyzing(true)
    try {
      await onAnalyze(text)
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleUseSample = () => {
    setText(SAMPLE_TEXT)
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BookOpen className="h-6 w-6 text-blue-600" />
          Phân tích văn bản tiếng Anh
        </CardTitle>
        <CardDescription>
          Paste đoạn văn tiếng Anh vào bên dưới để AI phân tích từ vựng, ngữ pháp và tạo bài tập
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Paste your English text here...&#x0a;&#x0a;Ví dụ: Climate change is one of the most significant challenges..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[300px] text-base"
              disabled={isAnalyzing}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                {wordCount} từ {wordCount < 10 && wordCount > 0 && "(Tối thiểu 10 từ)"}
              </p>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleUseSample}
                disabled={isAnalyzing}
              >
                Dùng văn bản mẫu
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isAnalyzing || wordCount < 10}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Phân tích với AI
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setText("")}
              disabled={isAnalyzing || !text}
            >
              Xóa
            </Button>
          </div>
        </form>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-1">📚 Từ vựng</h3>
            <p className="text-sm text-blue-700">
              Trích xuất từ mới với định nghĩa, ví dụ, phiên âm
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-1">🎯 Ngữ pháp</h3>
            <p className="text-sm text-purple-700">
              Phân tích cấu trúc ngữ pháp, giải thích chi tiết
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-1">🎴 Bài tập</h3>
            <p className="text-sm text-green-700">
              Flashcard và quiz để luyện tập
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
