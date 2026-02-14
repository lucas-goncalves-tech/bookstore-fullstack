import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    // Se status for 204 (No Content), retorna response vazio
    if (response.status === 204) {
      const res = new NextResponse(null, { status: 204 });
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        res.headers.set("set-cookie", setCookieHeader);
      }
      return res;
    }

    // Para outros status, parse o JSON
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    const res = NextResponse.json(data || { success: true }, { status: response.status });

    // Copia os cookies do backend para o response
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      res.headers.set("set-cookie", setCookieHeader);
    }

    return res;
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
