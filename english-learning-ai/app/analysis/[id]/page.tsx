"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { sessionStorage } from "@/lib/storage/session-storage"
import { LearningSession } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VocabularyCard } from "@/components/features/vocabulary/vocabulary-card"
import { GrammarCard } from "@/components/features/grammar/grammar-card"
import { ArrowLeft, BookOpen, GraduationCap, PlayCircle, Clock, FileText } from "lucide-react"
import { formatRelativeTime, truncateText, cn } from "@/lib/utils"
import Link from "next/link"

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<LearningSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = params.id as string
    const loadedSession = sessionStorage.getSession(sessionId)

    if (!loadedSession) {
      alert("Không tìm thấy phiên học. Vui lòng phân tích văn bản mới.")
      router.push("/")
      return
    }

    setSession(loadedSession)
    setLoading(false)
  }, [params.id, router])

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
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost" }), "mb-4")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Kết quả phân tích
                </h1>
                <p className="text-gray-600 mb-4">
                  {truncateText(session.original_text, 150)}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatRelativeTime(session.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {session.word_count} từ
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {session.vocabulary.length} từ vựng
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {session.grammar.length} ngữ pháp
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href={`/practice/flashcard/${session.id}`}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-gradient-to-r from-blue-600 to-purple-600"
                  )}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Bắt đầu học
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Original Text (Collapsible) */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📝 Văn bản gốc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg max-h-[300px] overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {session.original_text}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Vocabulary and Grammar */}
        <Tabs defaultValue="vocabulary" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="vocabulary" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Từ vựng ({session.vocabulary.length})
            </TabsTrigger>
            <TabsTrigger value="grammar" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Ngữ pháp ({session.grammar.length})
            </TabsTrigger>
          </TabsList>

          {/* Vocabulary Tab */}
          <TabsContent value="vocabulary">
            <div className="space-y-6">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>📖 Tổng quan từ vựng</CardTitle>
                  <CardDescription>
                    Danh sách các từ vựng quan trọng được AI phân tích
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {session.vocabulary.map((vocab) => (
                      <Badge
                        key={vocab.id}
                        variant="outline"
                        className="text-sm"
                      >
                        {vocab.word}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Vocabulary Cards */}
              <div className="grid grid-cols-1 gap-4">
                {session.vocabulary.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-gray-500">
                      Không tìm thấy từ vựng nào cần học
                    </CardContent>
                  </Card>
                ) : (
                  session.vocabulary.map((vocab) => (
                    <VocabularyCard
                      key={vocab.id}
                      vocabulary={vocab}
                      showActions={false}
                    />
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Grammar Tab */}
          <TabsContent value="grammar">
            <div className="space-y-6">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>🎯 Tổng quan ngữ pháp</CardTitle>
                  <CardDescription>
                    Các điểm ngữ pháp quan trọng trong văn bản
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {session.grammar.map((grammar) => (
                      <Badge
                        key={grammar.id}
                        variant="outline"
                        className="text-sm"
                      >
                        {grammar.structure}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Grammar Cards */}
              <div className="grid grid-cols-1 gap-4">
                {session.grammar.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-gray-500">
                      Không tìm thấy cấu trúc ngữ pháp nào
                    </CardContent>
                  </Card>
                ) : (
                  session.grammar.map((grammar) => (
                    <GrammarCard
                      key={grammar.id}
                      grammar={grammar}
                      defaultExpanded={false}
                    />
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
