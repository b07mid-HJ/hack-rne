"use client"

import { MessageSquare, FileIcon, FileText, CheckSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface WelcomeScreenProps {
  onQuickQuestion: (question: string) => void
  translations: any
}

export function WelcomeScreen({ onQuickQuestion, translations: t }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center text-center mb-8 mt-8 w-full">
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <MessageSquare className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.welcomeTitle}</h1>
      <p className="text-gray-600 mb-8">{t.welcomeMessage}</p>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.howCanIHelp}</h2>
      <p className="text-gray-600 mb-6">{t.chooseQuestion}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Card
          className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          onClick={() => onQuickQuestion(t.howToCreateSARL)}
        >
          <CardContent className="p-4 flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded">
              <FileIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">{t.companyCreation}</h3>
              <p className="text-sm text-gray-600">{t.howToCreateSARL}</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          onClick={() => onQuickQuestion(t.capitalModification)}
        >
          <CardContent className="p-4 flex items-start gap-3">
            <div className="bg-green-50 p-2 rounded">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">{t.statutoryModification}</h3>
              <p className="text-sm text-gray-600">{t.capitalModification}</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          onClick={() => onQuickQuestion(t.accountingObligations)}
        >
          <CardContent className="p-4 flex items-start gap-3">
            <div className="bg-purple-50 p-2 rounded">
              <CheckSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">{t.legalObligations}</h3>
              <p className="text-sm text-gray-600">{t.accountingObligations}</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          onClick={() => onQuickQuestion(t.registrationProcess)}
        >
          <CardContent className="p-4 flex items-start gap-3">
            <div className="bg-orange-50 p-2 rounded">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">{t.rneProcedures}</h3>
              <p className="text-sm text-gray-600">{t.registrationProcess}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
