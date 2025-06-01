import type { Message } from "@/lib/types"

export const mockMessages: Record<string, Message[]> = {
  "1": [
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
  ],
  "2": [
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
      references: [
        {
          id: "2",
          title: "Liste des documents requis",
          url: "/placeholder.pdf",
          type: "pdf",
        },
      ],
    },
  ],
}
