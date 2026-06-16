"use client"

import { GrammarPoint } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { getLevelColor, getLevelDescription } from "@/lib/utils"
import { useState } from "react"

interface GrammarCardProps {
  grammar: GrammarPoint
  defaultExpanded?: boolean
}

export function GrammarCard({ grammar, defaultExpanded = false }: GrammarCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-purple-600">
              {grammar.structure}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className={getLevelColor(grammar.level)}>
                {grammar.level} - {getLevelDescription(grammar.level)}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {grammar.category.replace("-", " ")}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Example from text */}
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            📍 Trong văn bản:
          </p>
          <p className="text-sm text-gray-700 font-mono">
            "{grammar.example_from_text}"
          </p>
        </div>

        {isExpanded && (
          <>
            {/* Explanations */}
            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  🇻🇳 Giải thích:
                </p>
                <p className="text-sm text-gray-700">{grammar.explanation_vi}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  🇬🇧 Explanation:
                </p>
                <p className="text-sm text-gray-700">{grammar.explanation_en}</p>
              </div>
            </div>

            {/* Formula */}
            {grammar.formula && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-800 mb-1">
                  📐 Công thức:
                </p>
                <p className="text-sm font-mono text-blue-900 font-semibold">
                  {grammar.formula}
                </p>
              </div>
            )}

            {/* More examples */}
            {grammar.more_examples && grammar.more_examples.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  ✏️ Ví dụ thêm:
                </p>
                <ul className="space-y-1">
                  {grammar.more_examples.map((example, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 pl-4 border-l-2 border-gray-200"
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common mistakes */}
            {grammar.common_mistakes && grammar.common_mistakes.length > 0 && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-xs font-semibold text-red-800 mb-2">
                  ⚠️ Lỗi thường gặp:
                </p>
                <ul className="space-y-1">
                  {grammar.common_mistakes.map((mistake, idx) => (
                    <li key={idx} className="text-sm text-red-700">
                      • {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {grammar.tips && grammar.tips.length > 0 && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-800 mb-2">
                  💡 Mẹo:
                </p>
                <ul className="space-y-1">
                  {grammar.tips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-green-700">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
