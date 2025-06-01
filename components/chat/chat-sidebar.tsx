"use client"

import { MessageSquare, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavUser } from "@/components/nav-user"
import { formatTimestamp } from "@/lib/utils/date"
import type { ChatSession, UserInfo } from "@/lib/types"

interface ChatSidebarProps {
  chatSessions: ChatSession[]
  currentChatId: string
  onChatSelect: (chatId: string) => void
  user: UserInfo
  translations: any
  loading?: boolean
}

export function ChatSidebar({
  chatSessions,
  currentChatId,
  onChatSelect,
  user,
  translations: t,
  loading = false,
}: ChatSidebarProps) {
  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-200">
        <div className="bg-blue-600 text-white p-2 rounded">
          <FileIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-blue-900">{t.title}</h2>
          <p className="text-xs text-gray-500">{t.subtitle}</p>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 py-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.chatHistory}</h3>
        </div>

        <div className="px-2">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
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
                  <span className="text-xs text-gray-500 mt-0.5">{formatTimestamp(session.timestamp)}</span>
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
