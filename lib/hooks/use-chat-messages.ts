"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { Message } from "@/lib/types"

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    if (!chatId) return

    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getChatMessages(chatId)

      // Ensure timestamps are Date objects
      const messagesWithDates = response.items.map((message) => ({
        ...message,
        timestamp: message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp),
      }))

      setMessages(messagesWithDates)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages")
      console.error("Error fetching messages:", err)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content: string, userId: string) => {
    try {
      // Create a temporary user message to display immediately
      const tempUserMessage: Message = {
        id: `temp-msg-${Date.now()}`,
        chatId,
        type: "user",
        content,
        timestamp: new Date(),
        userId,
      }
      
      // Add the temporary user message to the UI immediately
      setMessages((prev) => [...prev, tempUserMessage])
      
      // Add user message to the backend
      const userMessage = await apiClient.sendMessage({
        chatId,
        type: "user",
        content,
        userId,
      })

      // Ensure timestamp is a Date object
      const userMessageWithDate = {
        ...userMessage,
        timestamp: userMessage.timestamp instanceof Date ? userMessage.timestamp : new Date(userMessage.timestamp),
      }

      // Replace the temporary message with the real one
      setMessages((prev) => prev.map(msg => 
        msg.id === tempUserMessage.id ? userMessageWithDate : msg
      ))

      // Generate AI response using the real API
      const aiResponse = await apiClient.generateResponse({
        prompt: content,
        chatId,
        userId,
      })

      // Ensure timestamp is a Date object
      const aiResponseWithDate = {
        ...aiResponse,
        timestamp: aiResponse.timestamp instanceof Date ? aiResponse.timestamp : new Date(aiResponse.timestamp),
      }

      setMessages((prev) => [...prev, aiResponseWithDate])

      return { userMessage: userMessageWithDate, aiResponse: aiResponseWithDate }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message")
      console.error("Error sending message:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [chatId])

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
    sendMessage,
    setMessages,
  }
}
