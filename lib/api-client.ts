import type { ChatSession, Message, PaginatedResponse, UserInfo } from "./types"
import { getChatById, getUserChats, addChat, updateChat, deleteChat, getChatMessages, addMessage, getCurrentUser, updateUser, getProcessingSteps } from "./data/mock-data"

// Helper to simulate API delay
const simulateDelay = async (ms: number = 100) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

// Helper to create paginated response
const createPaginatedResponse = <T>(items: T[], page: number, limit: number, total: number) => {
  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  }
}

// Direct API client that works with mock data
export const apiClient = {
  // Chat Sessions
  async getChatSessions(userId: string, options: { page?: number; limit?: number; status?: string } = {}) {
    await simulateDelay(100)
    
    const { page = 1, limit = 10, status = "active" } = options
    
    // Get chats for user
    let chats = getUserChats(userId)
    
    // Filter by status if provided
    if (status) {
      chats = chats.filter(chat => chat.status === status)
    }
    
    // Sort by timestamp (newest first)
    chats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    
    // Paginate
    const startIndex = (page - 1) * limit
    const paginatedChats = chats.slice(startIndex, startIndex + limit)
    
    // Remove messagesData from response
    const formattedChats = paginatedChats.map(({ messagesData, ...chat }) => chat)
    
    return createPaginatedResponse(formattedChats, page, limit, chats.length)
  },
  
  async createChatSession(sessionData: { title: string; userId: string }) {
    await simulateDelay(150)
    
    const newChat: ChatSession & { messagesData: string } = {
      id: `chat-${Date.now()}`,
      title: sessionData.title,
      timestamp: new Date(),
      messageCount: 0,
      active: true,
      userId: sessionData.userId,
      status: "active",
      messagesData: JSON.stringify([]),
    }
    
    addChat(newChat)
    
    // Return without messagesData
    const { messagesData, ...chatWithoutMessages } = newChat
    return chatWithoutMessages
  },
  
  async getChatById(id: string) {
    await simulateDelay(100)
    
    const chat = getChatById(id)
    if (!chat) {
      throw new Error("Chat session not found")
    }
    
    // Return without messagesData
    const { messagesData, ...chatWithoutMessages } = chat
    return chatWithoutMessages
  },
  
  async updateChatSession(id: string, updates: Partial<ChatSession>) {
    await simulateDelay(150)
    
    const chat = getChatById(id)
    if (!chat) {
      throw new Error("Chat session not found")
    }
    
    updateChat(id, updates)
    
    const updatedChat = getChatById(id)
    if (!updatedChat) {
      throw new Error("Failed to update chat session")
    }
    
    // Return without messagesData
    const { messagesData, ...chatWithoutMessages } = updatedChat
    return chatWithoutMessages
  },
  
  async deleteChatSession(id: string) {
    await simulateDelay(150)
    
    const chat = getChatById(id)
    if (!chat) {
      throw new Error("Chat session not found")
    }
    
    deleteChat(id)
  },
  
  // Messages
  async getChatMessages(chatId: string, options: { page?: number; limit?: number } = {}) {
    await simulateDelay(100)
    
    const { page = 1, limit = 50 } = options
    
    const messages = getChatMessages(chatId)
    
    // Ensure timestamps are Date objects
    const messagesWithDates = messages.map(message => ({
      ...message,
      timestamp: message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp)
    }))
    
    // Sort by timestamp (oldest first for chat display)
    messagesWithDates.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    
    // Paginate
    const startIndex = (page - 1) * limit
    const paginatedMessages = messagesWithDates.slice(startIndex, startIndex + limit)
    
    return createPaginatedResponse(paginatedMessages, page, limit, messages.length)
  },
  
  async sendMessage(messageData: {
    chatId: string
    type: "user" | "bot"
    content: string
    userId: string
    suggestions?: any[]
    references?: any[]
  }) {
    await simulateDelay(150)
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: messageData.chatId,
      type: messageData.type,
      content: messageData.content,
      timestamp: new Date(),
      userId: messageData.userId,
      suggestions: messageData.suggestions,
      references: messageData.references,
    }
    
    addMessage(messageData.chatId, newMessage)
    
    return newMessage
  },
  
  // AI
  async generateResponse(data: {
    prompt: string
    chatId: string
    userId: string
    language?: string
  }) {
    await simulateDelay(2000)
    
    const { prompt, chatId, userId, language = "fr" } = data
    
    // Mock responses based on language
    const responses = {
      fr: "Voici quelques suggestions de noms pour votre entreprise basées sur votre description. J'ai vérifié leur disponibilité dans la base de données RNE :",
      en: "Here are some company name suggestions based on your description. I've checked their availability in the RNE database:",
      ar: "إليك بعض اقتراحات الأسماء لشركتك بناءً على وصفك. لقد تحققت من توفرها في قاعدة بيانات السجل الوطني للمؤسسات:",
    }
    
    // Mock company name suggestions
    const suggestions = [
      { id: "1", name: "TunisTech Solutions", status: "available", score: 95 },
      { id: "2", name: "Carthage Innovations", status: "available", score: 88 },
      { id: "3", name: "Medina Digital", status: "unavailable", score: 92 },
      { id: "4", name: "Sahara Ventures", status: "available", score: 85 },
      { id: "5", name: "Atlas Consulting", status: "unavailable", score: 90 },
    ]
    
    const aiMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      type: "bot",
      content: responses[language as keyof typeof responses] || responses.fr,
      timestamp: new Date(),
      userId: "ai",
      suggestions,
      references: [
        {
          id: "ref-1",
          title: "Guide to Business Registration in Tunisia",
          url: "https://www.tunisianregistry.gov.tn/business-guide",
          type: "article",
          description: "Official guide for registering businesses in Tunisia",
          category: "legal",
          tags: ["registration", "business", "legal"],
          createdAt: new Date("2023-01-15"),
          updatedAt: new Date("2023-06-20"),
        },
        {
          id: "ref-3",
          title: "Trademark Registration Process",
          url: "https://www.tunisianregistry.gov.tn/trademark",
          type: "document",
          description: "Step-by-step guide for trademark registration",
          category: "legal",
          tags: ["trademark", "intellectual property", "registration"],
          createdAt: new Date("2023-03-10"),
          updatedAt: new Date("2023-03-10"),
        }
      ],
      metadata: {
        model: "gpt-4",
        processingTime: 2000,
        language,
      },
    }
    
    // Add the AI message to the chat
    addMessage(chatId, aiMessage)
    
    return aiMessage
  },
  
  getProcessingSteps,
  
  // User
  async getCurrentUser() {
    await simulateDelay(100)
    return getCurrentUser()
  },
  
  async updateUser(updates: Partial<UserInfo>) {
    await simulateDelay(200)
    return updateUser(updates)
  },
}