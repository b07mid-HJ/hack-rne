"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatSidebar } from "./chat-sidebar"
import { ChatHeader } from "./chat-header"
import { WelcomeScreen } from "./welcome-screen"
import { MessageList } from "./message-list"
import { LoadingMessage } from "./loading-message"
import { PdfViewer } from "./pdf-viewer"
import { translations } from "@/lib/translations"
import { useChatSessions } from "@/lib/hooks/use-chat-sessions"
import { useChatMessages } from "@/lib/hooks/use-chat-messages"
import { apiClient } from "@/lib/api-client"
import type { Language, Reference, ProcessingStep, UserInfo, ChatSession } from "@/lib/types"
import { useRouter, useSearchParams } from "next/navigation"

export default function ChatInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatIdFromUrl = searchParams.get("chatId")
  
  // Generate a random session ID for new chats
  const generateSessionId = () => `session_${Math.random().toString(36).substring(2, 15)}`
  
  // Use this ref to track if we're manually creating a new chat
  const isCreatingNewChat = useRef(false)
  
  const [language, setLanguage] = useState<Language>("fr")
  const [currentChatId, setCurrentChatId] = useState(chatIdFromUrl || generateSessionId())
  const [user, setUser] = useState<UserInfo | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedPdf, setSelectedPdf] = useState<Reference | null>(null)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showWelcome, setShowWelcome] = useState(!chatIdFromUrl)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { sessions, loading: sessionsLoading, createSession, updateSession } = useChatSessions(user?.id || "1")

  const { messages, loading: messagesLoading, sendMessage, setMessages } = useChatMessages(currentChatId)

  const t = translations[language]
  const isRTL = language === "ar"

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await apiClient.getCurrentUser()
        setUser(userData)
      } catch (err) {
        console.error("Failed to load user:", err)
      }
    }
    loadUser()
  }, [])

  // Sync URL chat ID with state
  useEffect(() => {
    // Skip this effect if we're manually creating a new chat
    if (isCreatingNewChat.current) {
      isCreatingNewChat.current = false
      return
    }
    
    const urlChatId = searchParams.get("chatId")
    if (urlChatId) {
      if (urlChatId !== currentChatId) {
        setCurrentChatId(urlChatId)
        setShowWelcome(false)
      }
    } else {
      // If there's no chat ID in the URL, generate a new session ID
      const newSessionId = generateSessionId()
      setCurrentChatId(newSessionId)
      
      // Update URL with the new session ID
      router.push(`/?chatId=${newSessionId}`, { scroll: false })
      
      setShowWelcome(true)
      setMessages([])
    }
  }, [searchParams, currentChatId, setMessages, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const simulateProcessingSteps = async () => {
    const steps = await apiClient.getProcessingSteps(language)
    const processSteps = steps.map((step) => ({
      ...step,
      completed: false,
      active: false,
    }))

    setProcessingSteps(processSteps)
    setCurrentStepIndex(0)

    for (let i = 0; i < processSteps.length; i++) {
      setProcessingSteps((prev) =>
        prev.map((step, index) => ({
          ...step,
          active: index === i,
          completed: index < i,
        })),
      )
      setCurrentStepIndex(i)

      const delay = i === 0 ? 1000 : i === 1 ? 1500 : i === 2 ? 2000 : 1200
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    setProcessingSteps((prev) =>
      prev.map((step) => ({
        ...step,
        active: false,
        completed: true,
      })),
    )
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading || !user) return

    setShowWelcome(false)
    setIsLoading(true)
    setError("")

    try {
      // Use the current chat ID for the API call
      let chatId = currentChatId;
      
      // Update the chat session if needed
      if (!sessions.some((session: ChatSession) => session.id === chatId)) {
        await createSession(t.legalAssistant, chatId)
      }
      await sendMessage(input, user.id)
      await simulateProcessingSteps()
      
      setInput("")
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error)
    } finally {
      setIsLoading(false)
      setProcessingSteps([])
    }
  }

  const handleFeedback = (suggestionId: string, messageId: string, feedback: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              suggestions: msg.suggestions?.map((suggestion) =>
                suggestion.id === suggestionId ? { ...suggestion, feedback } : suggestion,
              ),
            }
          : msg,
      ),
    )
  }

  const handleGetMoreSuggestions = async () => {
    if (!user) return

    try {
      const aiResponse = await apiClient.generateResponse({
        prompt: "Generate more company name suggestions",
        chatId: currentChatId,
        userId: user.id,
        language,
      })
      
      setMessages((prev) => [...prev, aiResponse])
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = async () => {
    if (!user) return

    try {
      // Set flag to prevent useEffect from overriding our welcome screen
      isCreatingNewChat.current = true
      
      // Generate a new session ID for the new chat
      const newSessionId = generateSessionId()
      
      // Clear messages first
      setMessages([])
      
      // Show welcome screen before changing URL
      setShowWelcome(true)
      
      // Set the new chat ID
      setCurrentChatId(newSessionId)
      
      // Update URL with the new session ID - use replace to avoid adding to history
      router.replace(`/?chatId=${newSessionId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create new chat")
    }
  }

  const handleChatSelect = async (chatId: string) => {
    setCurrentChatId(chatId)

    // Update URL with chat ID
    router.push(`/?chatId=${chatId}`)

    // Update active status
    await updateSession(chatId, { active: true })

    // Deactivate other sessions
    sessions.forEach(async (session) => {
      if (session.id !== chatId && session.active) {
        await updateSession(session.id, { active: false })
      }
    })

    setShowWelcome(false)
  }

  const openPdfViewer = (reference: Reference) => {
    setSelectedPdf(reference)
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    setTimeout(() => {
      handleSend()
    }, 100)
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-white ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar */}
      <ChatSidebar
        chatSessions={sessions}
        currentChatId={currentChatId}
        onChatSelect={handleChatSelect}
        user={user}
        translations={t}
        loading={sessionsLoading}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Header */}
        <ChatHeader language={language} onLanguageChange={setLanguage} onNewChat={handleNewChat} translations={t} />

        {/* Chat Messages */}
        <ScrollArea className="flex-1 w-full">
          <div className="p-4 pb-20 w-full">
            <div className="w-full mx-auto">
              {showWelcome ? (
                <WelcomeScreen onQuickQuestion={handleQuickQuestion} translations={t} />
              ) : (
                <div className="space-y-6">
                  {messagesLoading ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <MessageList
                      messages={messages}
                      onFeedback={handleFeedback}
                      onGetMoreSuggestions={handleGetMoreSuggestions}
                      onOpenPdf={openPdfViewer}
                      translations={t}
                    />
                  )}

                  {isLoading && (
                    <LoadingMessage
                      processingSteps={processingSteps}
                      currentStepIndex={currentStepIndex}
                      translations={t}
                    />
                  )}

                  {error && (
                    <div className="flex justify-center">
                      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 shadow-sm">
                        {error}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 w-full">
          <div className="w-full mx-auto">
            <div className="relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.placeholder}
                disabled={isLoading}
                className="pr-12 py-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="sm"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-md ${isLoading 
                  ? 'bg-blue-400 hover:bg-blue-400' 
                  : 'bg-blue-600 hover:bg-blue-700'} disabled:bg-gray-200 disabled:text-gray-400 transition-colors duration-200`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin opacity-70"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">{t.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      <PdfViewer selectedPdf={selectedPdf} onClose={() => setSelectedPdf(null)} />
    </div>
  )
}
