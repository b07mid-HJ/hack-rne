"use client"

import { Brain, Database, Search, Shield, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { ProcessingStep } from "@/lib/types"

interface LoadingMessageProps {
  processingSteps: ProcessingStep[]
  currentStepIndex: number
  translations: any
}

export function LoadingMessage({ processingSteps, currentStepIndex, translations: t }: LoadingMessageProps) {
  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "thinking":
        return <Brain className="w-4 h-4" />
      case "searching":
        return <Database className="w-4 h-4" />
      case "generating":
        return <Search className="w-4 h-4" />
      case "validating":
        return <Shield className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-md">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span className="text-sm text-gray-500">{t.typing}</span>
          </div>

          {processingSteps.length > 0 && (
            <div className="space-y-3">
              <Progress value={((currentStepIndex + 1) / processingSteps.length) * 100} className="h-2 bg-gray-100" />
              <div className="space-y-2">
                {processingSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                      step.active ? "text-blue-600" : step.completed ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                        step.completed
                          ? "bg-green-100 border-green-200"
                          : step.active
                            ? "bg-blue-100 border-blue-200"
                            : "border-gray-200"
                      }`}
                    >
                      {step.completed ? <CheckCircle className="w-3 h-3" /> : getStepIcon(step.id)}
                    </div>
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
