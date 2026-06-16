import { NextRequest, NextResponse } from "next/server"
import { geminiService } from "@/lib/ai/gemini"
import type { AnalyzeTextRequest, AnalyzeTextResponse } from "@/lib/types"
import { generateId } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeTextRequest = await request.json()

    if (!body.text || body.text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      )
    }

    // Validate text length
    const wordCount = body.text.trim().split(/\s+/).length
    if (wordCount < 10) {
      return NextResponse.json(
        { error: "Text must contain at least 10 words" },
        { status: 400 }
      )
    }

    if (wordCount > 1000) {
      return NextResponse.json(
        { error: "Text is too long. Maximum 1000 words." },
        { status: 400 }
      )
    }

    // Analyze text with AI
    const analysis = await geminiService.analyzeText(body.text)

    // Generate session ID
    const sessionId = generateId()

    const response: AnalyzeTextResponse = {
      sessionId,
      analysis,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Analysis error:", error)

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "AI service configuration error. Please check API key." },
          { status: 500 }
        )
      }

      if (error.message.includes("quota") || error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "AI service rate limit exceeded. Please try again later." },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to analyze text. Please try again." },
      { status: 500 }
    )
  }
}
