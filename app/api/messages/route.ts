import { NextResponse } from "next/server"
import { getChatMessages, addMessage, getChatById } from "@/lib/data/mock-data"
import type { ApiResponse, Message, PaginatedResponse } from "@/lib/types"

export async function GET(request: Request): Promise<NextResponse<PaginatedResponse<Message>>> {
  try {
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get("chatId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    if (!chatId) {
      return NextResponse.json(
        {
          data: {
            items: [],
            total: 0,
            page: 1,
            limit: 50,
            hasMore: false,
          },
          success: false,
          error: "Chat ID is required",
        },
        { status: 400 },
      )
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const messages = getChatMessages(chatId)

    // Sort by timestamp (oldest first for chat display)
    const sortedMessages = [...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    // Paginate
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMessages = sortedMessages.slice(startIndex, endIndex)

    return NextResponse.json({
      data: {
        items: paginatedMessages,
        total: sortedMessages.length,
        page,
        limit,
        hasMore: endIndex < sortedMessages.length,
      },
      success: true,
      message: "Messages retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        data: {
          items: [],
          total: 0,
          page: 1,
          limit: 50,
          hasMore: false,
        },
        success: false,
        error: "Failed to fetch messages",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<Message>>> {
  try {
    const messageData = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: messageData.chatId,
      type: messageData.type,
      content: messageData.content,
      timestamp: new Date(),
      userId: messageData.userId,
      suggestions: messageData.suggestions,
      references: messageData.references,
      metadata: messageData.metadata,
    }

    // Add to mock data
    addMessage(messageData.chatId, newMessage)

    return NextResponse.json({
      data: newMessage,
      success: true,
      message: "Message created successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        data: null as any,
        success: false,
        error: "Failed to create message",
      },
      { status: 500 },
    )
  }
}
