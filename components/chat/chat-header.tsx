"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Language } from "@/lib/types"

interface ChatHeaderProps {
  language: Language
  onLanguageChange: (language: Language) => void
  onNewChat: () => void
  translations: any
}

export function ChatHeader({ language, onLanguageChange, onNewChat, translations: t }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
      </div>
      <div className="flex items-center gap-3">
        <Globe className="w-4 h-4 text-gray-500" />
        <Select value={language} onValueChange={(value: Language) => onLanguageChange(value)}>
          <SelectTrigger className="w-32 bg-white border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onNewChat} className="bg-blue-600 hover:bg-blue-700">
          {t.newChat}
        </Button>
      </div>
    </div>
  )
}
