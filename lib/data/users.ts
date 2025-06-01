import type { UserInfo } from "@/lib/types"

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

export const getCurrentUser = (): UserInfo => mockUsers[0]
