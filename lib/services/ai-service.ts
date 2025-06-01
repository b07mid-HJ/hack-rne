import { apiClient } from "./api"
import type { Message } from "@/lib/types"

export class AIService {
  static async generateResponse(data: {
    prompt: string
    chatId: string
    userId: string
    language?: string
  }): Promise<Message> {
    const response = await apiClient.post<Message>("/ai/generate", data)
    if (!response.success) {
      throw new Error(response.error || "Failed to generate AI response")
    }
    return response.data
  }

  static async getProcessingSteps(language = "fr") {
    // This could be an API call in the future
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
}
