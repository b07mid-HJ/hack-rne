import { NextResponse } from "next/server"
import { getCurrentUser, updateUser } from "@/lib/data/mock-data"
import type { ApiResponse, UserInfo } from "@/lib/types"

export async function GET(): Promise<NextResponse<ApiResponse<UserInfo>>> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const user = getCurrentUser()

    return NextResponse.json({
      data: user,
      success: true,
      message: "User retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        data: null as any,
        success: false,
        error: "Failed to fetch user",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request): Promise<NextResponse<ApiResponse<UserInfo>>> {
  try {
    const updates = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Update the user
    const updatedUser = updateUser(updates)

    return NextResponse.json({
      data: updatedUser,
      success: true,
      message: "User updated successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        data: null as any,
        success: false,
        error: "Failed to update user",
      },
      { status: 500 },
    )
  }
}
