import type { ApiResponse } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/api${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      // Parse dates in the response
      return this.parseDatesInResponse(data)
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  private parseDatesInResponse<T>(data: ApiResponse<T>): ApiResponse<T> {
    return {
      ...data,
      data: this.parseDatesRecursively(data.data),
    }
  }

  private parseDatesRecursively(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj
    }

    if (typeof obj === "string" && this.isDateString(obj)) {
      return new Date(obj)
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.parseDatesRecursively(item))
    }

    if (typeof obj === "object") {
      const parsed: any = {}
      for (const [key, value] of Object.entries(obj)) {
        if (this.isDateField(key) && typeof value === "string") {
          parsed[key] = new Date(value)
        } else {
          parsed[key] = this.parseDatesRecursively(value)
        }
      }
      return parsed
    }

    return obj
  }

  private isDateField(key: string): boolean {
    const dateFields = ["timestamp", "createdAt", "updatedAt", "lastActive", "date"]
    return dateFields.includes(key)
  }

  private isDateString(str: string): boolean {
    // Check if string looks like an ISO date
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
    return isoDateRegex.test(str) && !isNaN(Date.parse(str))
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint
    return this.request<T>(url, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
