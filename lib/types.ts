export type Language = "en" | "fr" | "ar"

export type UserInfo = {
  id: string
  name: string
  email: string
  avatar: string
  company?: string
  role?: string
  createdAt: Date
  lastActive: Date
}

export type Reference = {
  id: string
  title: string
  url: string
  type: "pdf" | "web"
  description?: string
  category?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export type ProcessingStep = {
  id: string
  label: string
  completed: boolean
  active: boolean
}

export type NamePair = {
  arabic: string
  french: string
}

export type CompanyNameSuggestion = {
  id: string
  name: string
  arabicName?: string
  status: "available" | "unavailable"
  feedback?: "up" | "down"
  score?: number
  reasons?: string[]
}

export type Message = {
  id: string
  chatId: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  userId: string
  suggestions?: CompanyNameSuggestion[]
  references?: Reference[]
  metadata?: Record<string, any>
}

export type ChatSession = {
  id: string
  title: string
  timestamp: Date
  messageCount: number
  active?: boolean
  userId: string
  lastMessage?: string
  status: "active" | "archived" | "deleted"
  tags?: string[]
  metadata?: Record<string, any>
}

export type ApiResponse<T> = {
  data: T
  success: boolean
  message?: string
  error?: string
}

export type PaginatedResponse<T> = ApiResponse<{
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}>
