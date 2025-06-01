"use client"

import { useEffect, useState } from "react"
import { MessageSquare, FileIcon, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavUser } from "@/components/nav-user"
import { formatTimestamp } from "@/lib/utils/date"
import type { ChatSession, UserInfo } from "@/lib/types"
import { apiClient } from "@/lib/api-client"

interface ChatSidebarProps {
  chatSessions: ChatSession[]
  currentChatId: string
  onChatSelect: (chatId: string) => void
  user: UserInfo
  translations: any
  loading?: boolean
}

export function ChatSidebar({
  chatSessions: initialChatSessions,
  currentChatId,
  onChatSelect,
  user,
  translations: t,
  loading: initialLoading = false,
}: ChatSidebarProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(initialChatSessions)
  const [loading, setLoading] = useState<boolean>(initialLoading)
  const [error, setError] = useState<string | null>(null)

  // Fetch chat sessions from the API
  const fetchChatSessions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.getChatSessions(user.id)
      setChatSessions(response.items)
    } catch (err) {
      console.error("Error fetching chat sessions:", err)
      setError("Failed to load chat history")
      // Keep the initial sessions as fallback
    } finally {
      setLoading(false)
    }
  }

  // Fetch sessions on component mount
  useEffect(() => {
    fetchChatSessions()
    
    // Set up polling to refresh sessions every 30 seconds
    const intervalId = setInterval(fetchChatSessions, 30000)
    
    return () => clearInterval(intervalId)
  }, [user.id])

  // Refresh when currentChatId changes to ensure the selected chat is highlighted
  useEffect(() => {
    // If the current chat ID is not in our list, fetch sessions
    if (currentChatId && !chatSessions.some(session => session.id === currentChatId)) {
      fetchChatSessions()
    }
  }, [currentChatId])

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded">
            <FileIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-blue-900">{t.title}</h2>
            <p className="text-xs text-gray-500">{t.subtitle}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={fetchChatSessions} 
          disabled={loading}
          title="Refresh chat history"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 py-3 flex justify-between items-center">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.chatHistory}</h3>
          <span className="text-xs text-gray-400">{chatSessions.length} chats</span>
        </div>

        {error && (
          <div className="px-4 py-2 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="px-2">
          {loading && chatSessions.length === 0 ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : chatSessions.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              <p>No chat history found</p>
              <p className="mt-1 text-xs">Start a new conversation</p>
            </div>
          ) : (
            chatSessions.map((session) => (
              <Button
                key={session.id}
                variant="ghost"
                className={`w-full justify-start text-left mb-1 h-auto py-3 px-3 ${
                  session.id === currentChatId
                    ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onChatSelect(session.id)}
              >
                <MessageSquare
                  className={`w-4 h-4 mr-3 flex-shrink-0 ${
                    session.id === currentChatId ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <span className="font-medium text-sm truncate w-full">{session.title}</span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    {formatTimestamp(session.timestamp)}
                    {session.messageCount > 0 && ` · ${session.messageCount} messages`}
                  </span>
                </div>
              </Button>
            ))
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-3 border-t border-gray-200">
        <NavUser user={user} />
      </div>
    </div>
  )
}
