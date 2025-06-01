import type { Reference } from "@/lib/types"

export const mockReferences: Reference[] = [
  {
    id: "1",
    title: "Guide de création SARL 2024",
    url: "/placeholder.pdf",
    type: "pdf",
    description: "Guide complet pour la création d'une SARL en Tunisie",
    category: "creation",
    tags: ["SARL", "création", "procédures"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Liste des documents requis",
    url: "/placeholder.pdf",
    type: "pdf",
    description: "Documents nécessaires pour l'enregistrement RNE",
    category: "documentation",
    tags: ["documents", "RNE", "enregistrement"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    title: "Réglementation fiscale des entreprises",
    url: "/placeholder.pdf",
    type: "pdf",
    description: "Obligations fiscales des sociétés tunisiennes",
    category: "fiscal",
    tags: ["fiscalité", "obligations", "déclarations"],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-15"),
  },
]
