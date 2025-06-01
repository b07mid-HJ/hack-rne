import { NextResponse } from "next/server"
import { getChatById, updateChat, deleteChat } from "@/lib/data/mock-data"
import type { ApiResponse, ChatSession } from "@/lib/types"

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<ChatSession>>> {
  try {
    const { id } = params

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const chat = getChatById(id)
    
    // Extract chat session without messages
    const session = chat ? { ...chat, messagesData: undefined } : undefined

    if (!session) {
      return NextResponse.json(
        {
          data: null as any,
          success: false,
          error: "Chat session not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      data: session,
      success: true,
      message: "Chat session retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        data: null as any,
        success: false,
        error: "Failed to fetch chat session",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<ChatSession>>> {
  try {
    const { id } = params
    const updates = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150))

    const chat = getChatById(id)

    if (!chat) {
      return NextResponse.json(
        {
          data: null as any,
          success: false,
          error: "Chat session not found",
        },
        { status: 404 },
      )
    }

    // Update the chat
    updateChat(id, {
      ...updates,
      timestamp: new Date(),
    })
    
    // Get the updated chat
    const updatedChat = getChatById(id)

    return NextResponse.json({
      data: updatedChat ? { ...updatedChat, messagesData: undefined } : null as any,
      success: true,
      message: "Chat session updated successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        data: null as any,
        success: false,
        error: "Failed to update chat session",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = params

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150))

    const chat = getChatById(id)

    if (!chat) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          error: "Chat session not found",
        },
        { status: 404 },
      )
    }

    // Delete the chat
    deleteChat(id)

    return NextResponse.json({
      data: null,
      success: true,
      message: "Chat session deleted successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        success: false,
        error: "Failed to delete chat session",
      },
      { status: 500 },
    )
  }
}
