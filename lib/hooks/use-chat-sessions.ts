"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { ChatSession } from "@/lib/types"

export function useChatSessions(userId: string) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getChatSessions(userId)

      // Ensure timestamps are Date objects
      const sessionsWithDates = response.items.map((session) => ({
        ...session,
        timestamp: session.timestamp instanceof Date ? session.timestamp : new Date(session.timestamp),
      }))

      setSessions(sessionsWithDates)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch chat sessions")
      console.error("Error fetching chat sessions:", err)
    } finally {
      setLoading(false)
    }
  }

  const createSession = async (title: string) => {
    try {
      const newSession = await apiClient.createChatSession({ title, userId })

      // Ensure timestamp is a Date object
      const sessionWithDate = {
        ...newSession,
        timestamp: newSession.timestamp instanceof Date ? newSession.timestamp : new Date(newSession.timestamp),
      }

      setSessions((prev) => [sessionWithDate, ...prev])
      return sessionWithDate
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create chat session")
      throw err
    }
  }

  const updateSession = async (id: string, updates: Partial<ChatSession>) => {
    try {
      const updatedSession = await apiClient.updateChatSession(id, updates)

      // Ensure timestamp is a Date object
      const sessionWithDate = {
        ...updatedSession,
        timestamp:
          updatedSession.timestamp instanceof Date ? updatedSession.timestamp : new Date(updatedSession.timestamp),
      }

      setSessions((prev) => prev.map((s) => (s.id === id ? sessionWithDate : s)))
      return sessionWithDate
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update chat session")
      throw err
    }
  }

  const deleteSession = async (id: string) => {
    try {
      await apiClient.deleteChatSession(id)
      setSessions((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete chat session")
      throw err
    }
  }

  useEffect(() => {
    if (userId) {
      fetchSessions()
    }
  }, [userId])

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  }
}
