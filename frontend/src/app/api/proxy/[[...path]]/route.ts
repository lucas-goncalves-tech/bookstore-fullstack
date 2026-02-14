import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path || [], "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path || [], "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path || [], "PUT");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path || [], "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path || [], "DELETE");
}

async function handleRequest(
  request: NextRequest,
  pathSegments: string[] | undefined,
  method: string
) {
  try {
    const path = pathSegments?.join("/") || "";
    const url = new URL(request.url);
    const searchParams = url.search;
    
    const targetUrl = `${API_URL}/${path}${searchParams}`;
    
    const cookieHeader = request.headers.get("cookie");
    
    const headers: Record<string, string> = {};
    
    // Copy relevant headers
    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }
    
    // Get body for non-GET requests
    let body: BodyInit | undefined;
    if (method !== "GET" && method !== "HEAD") {
      const contentType = request.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const jsonBody = await request.json();
        body = JSON.stringify(jsonBody);
        headers["Content-Type"] = "application/json";
      } else if (contentType?.includes("multipart/form-data")) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }
    
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });
    
    // Handle 204 No Content
    if (response.status === 204) {
      const res = new NextResponse(null, { status: 204 });
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        res.headers.set("set-cookie", setCookieHeader);
      }
      return res;
    }
    
    // Parse response
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    
    const res = NextResponse.json(data, { status: response.status });
    
    // Copy cookies from backend
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      res.headers.set("set-cookie", setCookieHeader);
    }
    
    return res;
  } catch (error) {
    console.error(`API proxy error (${method}):`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
