"use client"

import { FileText, ExternalLink, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatMessageTime } from "@/lib/utils/date"
import type { Message, Reference } from "@/lib/types"

interface MessageListProps {
  messages: Message[]
  onFeedback: (suggestionId: string, messageId: string, feedback: "up" | "down") => void
  onGetMoreSuggestions: () => void
  onOpenPdf: (reference: Reference) => void
  translations: any
}

export function MessageList({
  messages,
  onFeedback,
  onGetMoreSuggestions,
  onOpenPdf,
  translations: t,
}: MessageListProps) {
  return (
    <>
      {messages.map((message) => (
        <div key={message.id} className={`flex w-full ${message.type === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-full ${
              message.type === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200"
            } rounded-lg p-4 shadow-sm`}
          >
            {/* Message Content */}
            <div className={`${message.type === "bot" ? "text-gray-800" : "text-white"}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

              {/* Message timestamp */}
              <div className={`text-xs mt-2 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                {formatMessageTime(message.timestamp)}
              </div>

              {/* References */}
              {message.references && message.references.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{t.references}:</h4>
                  <div className="space-y-2">
                    {message.references.map((ref, index) => (
                      <button
                        key={ref.id}
                        onClick={() => onOpenPdf(ref)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs font-medium">
                          {index + 1}
                        </span>
                        <FileText className="w-3 h-3" />
                        <span>{ref.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Name Suggestions */}
              {message.suggestions && (
                <div className="mt-6 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                    {message.suggestions.map((suggestion) => (
                      <Card key={suggestion.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">{suggestion.name}</h3>
                            <Badge
                              variant={suggestion.status === "available" ? "default" : "destructive"}
                              className={
                                suggestion.status === "available"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {suggestion.status === "available" ? t.available : t.unavailable}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={suggestion.feedback === "up" ? "default" : "outline"}
                              onClick={() => onFeedback(suggestion.id, message.id, "up")}
                              className="flex items-center gap-1"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={suggestion.feedback === "down" ? "destructive" : "outline"}
                              onClick={() => onFeedback(suggestion.id, message.id, "down")}
                              className="flex items-center gap-1"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button
                    onClick={onGetMoreSuggestions}
                    variant="outline"
                    className="w-full flex items-center gap-2 mt-4"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t.getMore}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
