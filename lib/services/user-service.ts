import { apiClient } from "./api"
import type { UserInfo } from "@/lib/types"

export class UserService {
  static async getCurrentUser(): Promise<UserInfo> {
    const response = await apiClient.get<UserInfo>("/users/me")
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch user")
    }
    return response.data
  }

  static async updateUser(updates: Partial<UserInfo>): Promise<UserInfo> {
    const response = await apiClient.patch<UserInfo>("/users/me", updates)
    if (!response.success) {
      throw new Error(response.error || "Failed to update user")
    }
    return response.data
  }
}
