"use client"

import { VocabularyItem } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookMarked, Volume2 } from "lucide-react"
import { getLevelColor, getLevelDescription } from "@/lib/utils"
import { useState } from "react"

interface VocabularyCardProps {
  vocabulary: VocabularyItem
  showActions?: boolean
  compact?: boolean
}

export function VocabularyCard({
  vocabulary,
  showActions = true,
  compact = false,
}: VocabularyCardProps) {
  const [isExpanded, setIsExpanded] = useState(!compact)

  const speakWord = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(vocabulary.word)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
              {vocabulary.word}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={speakWord}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className={getLevelColor(vocabulary.level)}>
                {vocabulary.level} - {getLevelDescription(vocabulary.level)}
              </Badge>
              <Badge variant="secondary">{vocabulary.type}</Badge>
              {vocabulary.phonetic && (
                <span className="text-sm text-muted-foreground">
                  {vocabulary.phonetic}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Definitions */}
        <div>
          <p className="text-sm font-semibold text-gray-700">
            🇻🇳 {vocabulary.definition_vi}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            🇬🇧 {vocabulary.definition_en}
          </p>
        </div>

        {/* Context from original text */}
        {vocabulary.context_in_text && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xs font-semibold text-blue-800 mb-1">
              Trong văn bản:
            </p>
            <p className="text-sm text-gray-700 italic">
              "{vocabulary.context_in_text}"
            </p>
          </div>
        )}

        {/* Expandable section */}
        {!compact && (
          <>
            {/* Examples */}
            {vocabulary.examples && vocabulary.examples.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  💬 Ví dụ:
                </p>
                <ul className="space-y-1">
                  {vocabulary.examples.map((example, idx) => (
                    <li key={idx} className="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Synonyms & Antonyms */}
            <div className="flex flex-wrap gap-4">
              {vocabulary.synonyms && vocabulary.synonyms.length > 0 && (
                <div className="flex-1 min-w-[150px]">
                  <p className="text-xs font-semibold text-green-700 mb-1">
                    ✓ Từ đồng nghĩa:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {vocabulary.synonyms.map((syn, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-green-50">
                        {syn}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {vocabulary.antonyms && vocabulary.antonyms.length > 0 && (
                <div className="flex-1 min-w-[150px]">
                  <p className="text-xs font-semibold text-red-700 mb-1">
                    ✗ Từ trái nghĩa:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {vocabulary.antonyms.map((ant, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-red-50">
                        {ant}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Compact mode toggle */}
        {compact && (
          <Button
            variant="link"
            size="sm"
            className="w-full"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
