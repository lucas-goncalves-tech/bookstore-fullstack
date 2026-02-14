import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie");
    
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "GET",
      headers: {
        ...(cookieHeader && { cookie: cookieHeader }),
      },
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

    // Copia os cookies do backend (para remover o refresh token)
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      res.headers.set("set-cookie", setCookieHeader);
    }

    return res;
  } catch (error) {
    console.error("Logout proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
