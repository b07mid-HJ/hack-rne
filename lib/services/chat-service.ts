import { apiClient } from "./api"
import type { ChatSession, Message, PaginatedResponse } from "@/lib/types"

export class ChatService {
  static async getChatSessions(
    userId: string,
    options: {
      page?: number
      limit?: number
      status?: string
    } = {},
  ): Promise<PaginatedResponse<ChatSession>["data"]> {
    const params = {
      userId,
      page: options.page?.toString() || "1",
      limit: options.limit?.toString() || "10",
      status: options.status || "active",
    }

    const response = await apiClient.get<PaginatedResponse<ChatSession>["data"]>("/chat-sessions", params)

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch chat sessions")
    }

    return response.data
  }

  static async createChatSession(sessionData: {
    title: string
    userId: string
  }): Promise<ChatSession> {
    const response = await apiClient.post<ChatSession>("/chat-sessions", sessionData)
    if (!response.success) {
      throw new Error(response.error || "Failed to create chat session")
    }
    return response.data
  }

  static async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    const response = await apiClient.patch<ChatSession>(`/chat-sessions/${id}`, updates)
    if (!response.success) {
      throw new Error(response.error || "Failed to update chat session")
    }
    return response.data
  }

  static async deleteChatSession(id: string): Promise<void> {
    const response = await apiClient.delete(`/chat-sessions/${id}`)
    if (!response.success) {
      throw new Error(response.error || "Failed to delete chat session")
    }
  }

  static async getChatMessages(
    chatId: string,
    options: {
      page?: number
      limit?: number
    } = {},
  ): Promise<PaginatedResponse<Message>["data"]> {
    const params = {
      chatId,
      page: options.page?.toString() || "1",
      limit: options.limit?.toString() || "50",
    }

    const response = await apiClient.get<PaginatedResponse<Message>["data"]>("/messages", params)

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch messages")
    }

    return response.data
  }

  static async sendMessage(messageData: {
    chatId: string
    type: "user" | "bot"
    content: string
    userId: string
    suggestions?: any[]
    references?: any[]
  }): Promise<Message> {
    const response = await apiClient.post<Message>("/messages", messageData)
    if (!response.success) {
      throw new Error(response.error || "Failed to send message")
    }
    return response.data
  }
}
