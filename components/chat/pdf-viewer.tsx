"use client"

import { FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Reference } from "@/lib/types"

interface PdfViewerProps {
  selectedPdf: Reference | null
  onClose: () => void
}

export function PdfViewer({ selectedPdf, onClose }: PdfViewerProps) {
  return (
    <Dialog open={!!selectedPdf} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {selectedPdf?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 bg-gray-100 rounded-lg p-4">
          {selectedPdf && (
            <iframe src={selectedPdf.url} className="w-full h-full rounded border" title={selectedPdf.title} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
