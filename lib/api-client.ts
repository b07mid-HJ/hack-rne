import type { ChatSession, Message, PaginatedResponse, UserInfo, NamePair } from "./types"
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
    
    const { page = 1, limit = 10, status = "active" } = options
    
    try {
      // Call the real API to get the list of sessions
      const response = await fetch('http://localhost:5000/api/sessions')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Transform the API response to match our expected format
      const sessions = data.sessions.map((session: any) => ({
        id: session.session_id,
        title: `Chat ${session.session_id.substring(0, 8)}`,
        timestamp: new Date(session.last_activity || session.created_at),
        messageCount: session.message_count || 0,
        active: true,
        userId: userId,
        status: "active"
      }))
      
      return {
        items: sessions,
        page,
        limit,
        totalItems: sessions.length,
        totalPages: Math.ceil(sessions.length / limit)
      }
    } catch (error) {
      console.error("Error fetching sessions:", error)
      
      // Fallback to mock data if the API call fails
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
    }
  },
  
  async createChatSession(sessionData: { title: string; userId: string; id?: string }) {
    
    try {
      // Try to use the real API if available
      const response = await fetch('http://localhost:5000/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionData.id || `session_${Date.now()}`,
        })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status}`)
      }
      
      const data = await response.json()
      
      return {
        id: data.session_id || sessionData.id || `chat-${Date.now()}`,
        title: sessionData.title,
        timestamp: new Date(),
        messageCount: 0,
        active: true,
        userId: sessionData.userId,
        status: "active"
      }
    } catch (error) {
      console.error("Error creating session:", error)
      
      // Fallback to mock data
      const newChat: ChatSession & { messagesData: string } = {
        id: sessionData.id || `chat-${Date.now()}`,
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
    }
  },
  
  async getChatById(id: string) {
    
    try {
      // Try to use the real API if available
      const response = await fetch(`http://localhost:5000/api/sessions/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to get session: ${response.status}`)
      }
      
      const data = await response.json()
      
      return {
        id: data.session_id,
        title: `Chat ${data.session_id.substring(0, 8)}`,
        timestamp: new Date(data.last_activity || data.created_at),
        messageCount: data.message_count || 0,
        active: true,
        userId: "user", // Default user ID
        status: "active"
      }
    } catch (error) {
      console.error("Error getting session:", error)
      
      // Fallback to mock data
      const chat = getChatById(id)
      if (!chat) {
        throw new Error("Chat session not found")
      }
      
      // Return without messagesData
      const { messagesData, ...chatWithoutMessages } = chat
      return chatWithoutMessages
    }
  },
  
  async updateChatSession(id: string, updates: Partial<ChatSession>) {
    
    try {
      // Real API doesn't have a specific update endpoint, so we'll just get the session
      // to confirm it exists
      const response = await fetch(`http://localhost:5000/api/sessions/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to get session for update: ${response.status}`)
      }
      
      // Return the session with updates applied
      const data = await response.json()
      
      return {
        id: data.session_id,
        title: updates.title || `Chat ${data.session_id.substring(0, 8)}`,
        timestamp: new Date(data.last_activity || data.created_at),
        messageCount: data.message_count || 0,
        active: updates.active !== undefined ? updates.active : true,
        userId: updates.userId || "user",
        status: updates.status || "active"
      }
    } catch (error) {
      console.error("Error updating session:", error)
      
      // Fallback to mock data
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
    }
  },
  
  async deleteChatSession(id: string) {
    
    try {
      // Try to use the real API if available
      const response = await fetch(`http://localhost:5000/api/sessions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete session: ${response.status}`)
      }
      
      return true
    } catch (error) {
      console.error("Error deleting session:", error)
      
      // Fallback to mock data
      const chat = getChatById(id)
      if (!chat) {
        throw new Error("Chat session not found")
      }
      
      deleteChat(id)
      return true
    }
  },
  
  // Messages
  async getChatMessages(chatId: string, options: { page?: number; limit?: number } = {}) {
    
    try {
      // Try to use the real API if available
      const response = await fetch(`http://localhost:5000/api/sessions/${chatId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to get session messages: ${response.status}`)
      }
      
      const data = await response.json()
      const { page = 1, limit = 50 } = options
      
      // Extract messages from the API response
      let apiMessages: Message[] = []
      
      if (data.messages_with_states && Array.isArray(data.messages_with_states)) {
        apiMessages = data.messages_with_states.map((msg: any, index: number) => {
          // Determine message type based on the API response
          const isUserMessage = msg.type === "HumanMessage"
          
          // Extract suggestions if available
          let suggestions = undefined
          if (!isUserMessage && msg.state && msg.state.name_pairs && Array.isArray(msg.state.name_pairs)) {
            suggestions = msg.state.name_pairs.map((pair: NamePair, idx: number) => ({
              id: `${idx + 1}`,
              name: pair.french,
              arabicName: pair.arabic,
              status: "available",
              score: 95 - idx * 2
            }))
          }
          
          return {
            id: `msg-${index}`,
            chatId,
            type: isUserMessage ? "user" : "bot",
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            userId: isUserMessage ? "user" : "ai",
            suggestions: suggestions,
            references: undefined,
            metadata: isUserMessage ? undefined : {
              model: "gpt-4",
              processingTime: 2000,
              language: "fr"
            }
          }
        })
      }
      
      // Sort by timestamp (oldest first for chat display)
      apiMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      
      // Paginate
      const startIndex = (page - 1) * limit
      const paginatedMessages = apiMessages.slice(startIndex, startIndex + limit)
      
      return createPaginatedResponse(paginatedMessages, page, limit, apiMessages.length)
    } catch (error) {
      console.error("Error getting chat messages:", error)
      
      // Fallback to mock data
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
    }
  },
  
  async sendMessage(messageData: {
    chatId: string
    type: "user" | "bot"
    content: string
    userId: string
    suggestions?: any[]
    references?: any[]
  }) {
    
    if (messageData.type === "user") {
      try {
        // Only send user messages to the API
        const response = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageData.content,
            session_id: messageData.chatId
          })
        })
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }
        
        // We don't need the response here as the generateResponse function will handle it
      } catch (error) {
        console.error("Error sending message to API:", error)
        // Continue with mock data if API fails
      }
    }
    
    // Create and return the message (the API response will be handled separately)
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
    
    // Add to mock data for fallback
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
    const { prompt, chatId, userId, language = "fr" } = data
    
    try {
      // Call the real API
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          session_id: chatId
        })
      })
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      
      const responseData = await response.json()
      
      // Extract name pairs from the response if available
      const namePairs = responseData.message_state?.name_pairs || []
      
      // Convert name pairs to suggestions format
      const suggestions = namePairs.map((pair: NamePair, index: number) => ({
        id: `${index + 1}`,
        name: pair.french,
        arabicName: pair.arabic,
        status: "available", // All names are available as per requirements
        score: 95 - index * 2 // Just for display purposes
      }))
      
      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        chatId,
        type: "bot",
        content: responseData.response || "Je n'ai pas de réponse pour le moment.",
        timestamp: new Date(),
        userId: "ai",
        suggestions: suggestions.length > 0 ? suggestions : undefined,
        metadata: {
          model: "gpt-4",
          processingTime: 2000,
          language,
          rawResponse: responseData
        },
      }
      
      // Add the AI message to the chat
      addMessage(chatId, aiMessage)
      
      return aiMessage
    } catch (error) {
      console.error('Error calling chat API:', error)
      throw error
    }
  },
  
  // Get chat history from the API
  async getChatHistory(sessionId: string) {
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching chat history:', error)
      throw error
    }
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