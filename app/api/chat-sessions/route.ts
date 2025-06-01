import { NextResponse } from "next/server"
import { getUserChats, addChat } from "@/lib/data/mock-data"
import type { ApiResponse, ChatSession, PaginatedResponse } from "@/lib/types"

export async function GET(request: Request): Promise<NextResponse<PaginatedResponse<ChatSession>>> {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "active"
    const userId = searchParams.get("userId") || "1"

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150))

    // Get user chats and filter by status
    const userChats = getUserChats(userId).filter(chat => chat.status === status)
    
    // Sort by timestamp (newest first)
    userChats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Paginate
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedSessions = userChats.slice(startIndex, endIndex).map(({ messagesData, ...chatSession }) => chatSession)

    return NextResponse.json({
      data: {
        items: paginatedSessions,
        total: userChats.length,
        page,
        limit,
        hasMore: endIndex < userChats.length,
      },
      success: true,
      message: "Chat sessions retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        data: {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
          hasMore: false,
        },
        success: false,
        error: "Failed to fetch chat sessions",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<ChatSession>>> {
  try {
    const sessionData = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: sessionData.title || "Nouvelle conversation",
      timestamp: new Date(),
      messageCount: 0,
      active: true,
      userId: sessionData.userId || "1",
      status: "active",
      ...sessionData,
    }

    // Create a new chat with empty messages array
    const newChat = {
      ...newSession,
      messagesData: JSON.stringify([])
    }
    
    // Add to mock data
    addChat(newChat)

    return NextResponse.json({
      data: newSession,
      success: true,
      message: "Chat session created successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        data: null as any,
        success: false,
        error: "Failed to create chat session",
      },
      { status: 500 },
    )
  }
}
