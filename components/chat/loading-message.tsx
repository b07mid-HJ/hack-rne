"use client"

import { useState, useEffect } from "react"
import type { ProcessingStep } from "@/lib/types"

interface LoadingMessageProps {
  processingSteps: ProcessingStep[]
  currentStepIndex: number
  translations: any
}

export function LoadingMessage({ processingSteps, currentStepIndex, translations: t }: LoadingMessageProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Messages to display while loading
  const loadingMessages = [
    t.loadingMessage1 || "Searching for the perfect name...",
    t.loadingMessage2 || "Checking name availability...",
    t.loadingMessage3 || "Finding creative options for you...",
    t.loadingMessage4 || "Looking for unique business names...",
    t.loadingMessage5 || "Analyzing market trends..."
  ];
  
  // Rotate through messages every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [loadingMessages.length]);
  
  return (
    <div className="flex justify-start my-4">
      <div className="bg-white border border-gray-100 rounded-lg py-3 px-4 max-w-md">
        <div className="flex items-center gap-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <span className="text-sm text-gray-600">{loadingMessages[messageIndex]}</span>
        </div>
      </div>
    </div>
  )
}
