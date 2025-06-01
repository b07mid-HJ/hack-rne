import { NextResponse } from "next/server"
import { addMessage } from "@/lib/data/mock-data"
import type { ApiResponse, Message, CompanyNameSuggestion, Reference } from "@/lib/types"

export async function POST(request: Request): Promise<NextResponse<ApiResponse<Message>>> {
  try {
    const { prompt, chatId, userId, language = "fr" } = await request.json()

    if (!prompt || !chatId || !userId) {
      return NextResponse.json(
        {
          data: null as any,
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock AI response based on language
    const responses = {
      fr: "Voici quelques suggestions de noms pour votre entreprise basées sur votre description. J'ai vérifié leur disponibilité dans la base de données RNE :",
      en: "Here are some company name suggestions based on your description. I've checked their availability in the RNE database:",
      ar: "إليك بعض اقتراحات الأسماء لشركتك بناءً على وصفك. لقد تحققت من توفرها في قاعدة بيانات السجل الوطني للمؤسسات:",
    }

    // Mock company name suggestions
    const suggestions: CompanyNameSuggestion[] = [
      { id: "1", name: "TunisTech Solutions", status: "available", score: 95 },
      { id: "2", name: "Carthage Innovations", status: "available", score: 88 },
      { id: "3", name: "Medina Digital", status: "unavailable", score: 92 },
      { id: "4", name: "Sahara Ventures", status: "available", score: 85 },
      { id: "5", name: "Atlas Consulting", status: "unavailable", score: 90 },
    ]

    const aiMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      type: "bot",
      content: responses[language as keyof typeof responses] || responses.fr,
      timestamp: new Date(),
      userId: "ai",
      suggestions,
      references: [
        {
          id: "ref-1",
          title: "Guide to Business Registration in Tunisia",
          url: "https://www.tunisianregistry.gov.tn/business-guide",
          type: "article",
          description: "Official guide for registering businesses in Tunisia",
          category: "legal",
          tags: ["registration", "business", "legal"],
          createdAt: new Date("2023-01-15"),
          updatedAt: new Date("2023-06-20"),
        },
        {
          id: "ref-3",
          title: "Trademark Registration Process",
          url: "https://www.tunisianregistry.gov.tn/trademark",
          type: "document",
          description: "Step-by-step guide for trademark registration",
          category: "legal",
          tags: ["trademark", "intellectual property", "registration"],
          createdAt: new Date("2023-03-10"),
          updatedAt: new Date("2023-03-10"),
        }
      ],
      metadata: {
        model: "gpt-4",
        processingTime: 2000,
        language,
      },
    }

    return NextResponse.json({
      data: aiMessage,
      success: true,
      message: "AI response generated successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        data: null as any,
        success: false,
        error: "Failed to generate AI response",
      },
      { status: 500 },
    )
  }
}
