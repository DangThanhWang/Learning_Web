"use client"

import { useEffect, useState } from "react"
import { sessionStorage } from "@/lib/storage/session-storage"
import { LearningSession } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, Clock, FileText, PlayCircle, Trash2, Search } from "lucide-react"
import { formatRelativeTime, truncateText, cn } from "@/lib/utils"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function HistoryPage() {
  const [sessions, setSessions] = useState<LearningSession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<LearningSession[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSessions(sessions)
    } else {
      const filtered = sessionStorage.searchSessions(searchQuery)
      setFilteredSessions(filtered)
    }
  }, [searchQuery, sessions])

  const loadSessions = () => {
    const allSessions = sessionStorage.getAllSessions()
    setSessions(allSessions)
    setFilteredSessions(allSessions)
    setLoading(false)
  }

  const handleDelete = (sessionId: string) => {
    if (confirm("Bạn có chắc muốn xóa phiên học này?")) {
      sessionStorage.deleteSession(sessionId)
      loadSessions()
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📚 Lịch sử học tập
          </h1>
          <p className="text-gray-600">
            Các bài văn và phiên học bạn đã lưu
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo nội dung hoặc từ vựng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchQuery
                  ? "Không tìm thấy kết quả"
                  : "Chưa có phiên học nào"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Thử tìm kiếm với từ khóa khác"
                  : "Hãy phân tích văn bản tiếng Anh để bắt đầu học"}
              </p>
              {!searchQuery && (
                <Link href="/" className={buttonVariants()}>
                  Phân tích văn bản
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {session.title || "Untitled Session"}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {truncateText(session.original_text, 200)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatRelativeTime(session.updated_at)}
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

                  {/* Progress */}
                  {session.progress.vocabulary_studied.length > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Tiến độ học:</span>
                        <span className="font-semibold text-blue-600">
                          {session.progress.vocabulary_studied.length}/
                          {session.vocabulary.length} từ
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              (session.progress.vocabulary_studied.length /
                                session.vocabulary.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/analysis/${session.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "flex-1"
                      )}
                    >
                      Xem chi tiết
                    </Link>
                    <Link
                      href={`/practice/flashcard/${session.id}`}
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                      )}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Học flashcard
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Statistics Summary */}
        {sessions.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>📊 Thống kê tổng quan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {sessions.length}
                  </div>
                  <div className="text-sm text-gray-600">Phiên học</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {sessions.reduce((sum, s) => sum + s.vocabulary.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Từ vựng</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {sessions.reduce((sum, s) => sum + s.progress.vocabulary_studied.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Đã học</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {sessions.reduce((sum, s) => sum + s.progress.flashcard_reviews, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Lần ôn tập</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
