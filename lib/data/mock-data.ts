import type { UserInfo, ChatSession, Message } from "@/lib/types"

// Mock users data
export const mockUsers: UserInfo[] = [
  {
    id: "1",
    name: "Ahmed Ben Salem",
    email: "ahmed@techsolutions.tn",
    avatar: "/placeholder.svg?height=40&width=40",
    company: "Tech Solutions SARL",
    role: "CEO",
    createdAt: new Date("2023-01-15"),
    lastActive: new Date(),
  },
  {
    id: "2",
    name: "Fatima Mansouri",
    email: "fatima@innovate.tn",
    avatar: "/placeholder.svg?height=40&width=40",
    company: "Innovate Tunisia",
    role: "Legal Director",
    createdAt: new Date("2023-03-20"),
    lastActive: new Date(Date.now() - 86400000),
  },
]

// Mock chats data with messages as a JSON field
export const mockChats: Record<string, ChatSession & { messagesData: string }> = {
  "1": {
    id: "1",
    title: "Assistant juridique",
    timestamp: new Date(Date.now() - 86400000),
    messageCount: 2,
    active: true,
    userId: "1",
    lastMessage: "Pour créer une SARL en Tunisie, vous devez suivre plusieurs étapes importantes...",
    status: "active",
    messagesData: JSON.stringify([
      {
        id: "msg-1",
        chatId: "1",
        type: "user",
        content: "Comment créer une SARL en Tunisie ?",
        timestamp: new Date(Date.now() - 3600000),
        userId: "1",
      },
      {
        id: "msg-2",
        chatId: "1",
        type: "bot",
        content: "Pour créer une SARL en Tunisie, vous devez suivre plusieurs étapes importantes...",
        timestamp: new Date(Date.now() - 3500000),
        userId: "ai",
        suggestions: [
          { id: "1", name: "TunisTech Solutions", status: "available" },
          { id: "2", name: "Carthage Innovations", status: "available" },
          { id: "3", name: "Medina Digital", status: "unavailable" },
        ],
        references: [
          {
            id: "1",
            title: "Guide de création SARL 2024",
            url: "/placeholder.pdf",
            type: "pdf",
          },
        ],
      },
    ]),
  },
  "2": {
    id: "2",
    title: "Création SARL",
    timestamp: new Date(Date.now() - 172800000),
    messageCount: 2,
    active: false,
    userId: "1",
    lastMessage: "Les documents nécessaires pour créer une SARL incluent...",
    status: "active",
    messagesData: JSON.stringify([
      {
        id: "msg-3",
        chatId: "2",
        type: "user",
        content: "Quels sont les documents nécessaires ?",
        timestamp: new Date(Date.now() - 172800000),
        userId: "1",
      },
      {
        id: "msg-4",
        chatId: "2",
        type: "bot",
        content: "Les documents nécessaires pour créer une SARL incluent...",
        timestamp: new Date(Date.now() - 172700000),
        userId: "ai",
        references: [
          {
            id: "2",
            title: "Liste des documents requis",
            url: "/placeholder.pdf",
            type: "pdf",
          },
        ],
      },
    ]),
  },
  "3": {
    id: "3",
    title: "Modification capital",
    timestamp: new Date(Date.now() - 259200000),
    messageCount: 0,
    active: false,
    userId: "1",
    lastMessage: "Comment procéder à l'augmentation du capital social ?",
    status: "active",
    messagesData: JSON.stringify([]),
  },
  "4": {
    id: "4",
    title: "Obligations fiscales",
    timestamp: new Date(Date.now() - 345600000),
    messageCount: 0,
    active: false,
    userId: "1",
    lastMessage: "Quelles sont les déclarations fiscales obligatoires ?",
    status: "archived",
    messagesData: JSON.stringify([]),
  },
  "5": {
    id: "5",
    title: "Dissolution société",
    timestamp: new Date(Date.now() - 432000000),
    messageCount: 0,
    active: false,
    userId: "1",
    lastMessage: "Procédure de dissolution volontaire d'une SARL.",
    status: "active",
    messagesData: JSON.stringify([]),
  },
}

// Helper functions to work with mock data
export const getCurrentUser = (): UserInfo => mockUsers[0]

// Update user information
export const updateUser = (updates: Partial<UserInfo>): UserInfo => {
  mockUsers[0] = { ...mockUsers[0], ...updates, updatedAt: new Date() }
  return mockUsers[0]
}

// Get all chats for a user
export const getUserChats = (userId: string): (ChatSession & { messagesData: string })[] => {
  return Object.values(mockChats).filter(chat => chat.userId === userId)
}

// Get a specific chat by ID
export const getChatById = (chatId: string): (ChatSession & { messagesData: string }) | undefined => {
  return mockChats[chatId]
}

// Add a new chat
export const addChat = (chat: ChatSession & { messagesData: string }): void => {
  mockChats[chat.id] = chat
}

// Update an existing chat
export const updateChat = (chatId: string, updates: Partial<ChatSession>): void => {
  if (mockChats[chatId]) {
    mockChats[chatId] = { ...mockChats[chatId], ...updates }
  }
}

// Delete a chat
export const deleteChat = (chatId: string): void => {
  delete mockChats[chatId]
}

// Get messages for a chat
export const getChatMessages = (chatId: string): Message[] => {
  const chat = mockChats[chatId]
  if (!chat) return []
  
  try {
    return JSON.parse(chat.messagesData) as Message[]
  } catch (error) {
    console.error("Error parsing messages data:", error)
    return []
  }
}

// Add a message to a chat
export const addMessage = (chatId: string, message: Message): void => {
  const chat = mockChats[chatId]
  if (!chat) return
  
  try {
    const messages = JSON.parse(chat.messagesData) as Message[]
    messages.push(message)
    
    mockChats[chatId] = {
      ...chat,
      messagesData: JSON.stringify(messages),
      messageCount: messages.length,
      lastMessage: message.content,
      timestamp: message.timestamp,
    }
  } catch (error) {
    console.error("Error adding message:", error)
  }
}

// Get processing steps for AI
export const getProcessingSteps = (language = "fr") => {
  const steps = {
    fr: [
      { id: "thinking", label: "Réflexion" },
      { id: "searching", label: "Recherche en base" },
      { id: "generating", label: "Génération de noms" },
      { id: "validating", label: "Validation des règles" },
    ],
    en: [
      { id: "thinking", label: "Thinking" },
      { id: "searching", label: "Searching database" },
      { id: "generating", label: "Generating names" },
      { id: "validating", label: "Validating rules" },
    ],
    ar: [
      { id: "thinking", label: "التفكير" },
      { id: "searching", label: "البحث في قاعدة البيانات" },
      { id: "generating", label: "توليد الأسماء" },
      { id: "validating", label: "التحقق من القواعد" },
    ],
  }

  return steps[language as keyof typeof steps] || steps.fr
}