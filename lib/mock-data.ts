import type { Reference, ChatSession, UserInfo } from "./types"

export const mockReferences: Reference[] = [
  {
    id: "1",
    title: "Tunisia Business Registration Guide 2024",
    url: "/placeholder.pdf",
    type: "pdf",
  },
  {
    id: "2",
    title: "RNE Legal Requirements Documentation",
    url: "/placeholder.pdf",
    type: "pdf",
  },
  {
    id: "3",
    title: "Company Naming Conventions in Tunisia",
    url: "/placeholder.pdf",
    type: "pdf",
  },
]

export const mockChatSessions: ChatSession[] = [
  { id: "1", title: "Assistant juridique", timestamp: new Date(Date.now() - 86400000), messageCount: 8, active: true },
  { id: "2", title: "Création SARL", timestamp: new Date(Date.now() - 172800000), messageCount: 12 },
  { id: "3", title: "Modification capital", timestamp: new Date(Date.now() - 259200000), messageCount: 6 },
  { id: "4", title: "Obligations fiscales", timestamp: new Date(Date.now() - 345600000), messageCount: 15 },
]

export const userInfo: UserInfo = {
  name: "Ahmed Ben Salem",
  email: "ahmed@techsolutions.tn",
  avatar: "/placeholder.svg?height=40&width=40",
}
