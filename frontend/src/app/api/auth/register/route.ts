import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Se status for 204 (No Content), retorna response vazio
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Para outros status, parse o JSON
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    return NextResponse.json(data || { success: true }, { status: response.status });
  } catch (error) {
    console.error("Register proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
