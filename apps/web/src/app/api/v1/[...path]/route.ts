import { NextRequest, NextResponse } from 'next/server'

// Resolve the backend URL:
// 1. API_URL (Server-side env var) - should include /api/v1
// 2. NEXT_PUBLIC_API_URL (Client-side env var) - strip /api/v1 if present
// 3. Fallback to localhost:4000
const getBackendUrl = () => {
  // If API_URL is set, use it directly (should already include /api/v1)
  if (process.env.API_URL) {
    const apiUrl = process.env.API_URL;
    // Strip /api/v1 suffix if present
    return apiUrl.replace(/\/api\/v1\/?$/, '');
  }
  
  // If NEXT_PUBLIC_API_URL is set, strip /api/v1 if present
  if (process.env.NEXT_PUBLIC_API_URL) {
    const publicUrl = process.env.NEXT_PUBLIC_API_URL;
    // Strip /api/v1 from start or end
    return publicUrl.replace(/^\/api\/v1\/?/, '').replace(/\/api\/v1\/?$/, '') || publicUrl;
  }
  
  return 'http://localhost:4000';
};

const BACKEND_URL = getBackendUrl();

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path)
}

async function proxyRequest(request: NextRequest, path: string[]) {
  const pathString = path.join('/')
  const url = `${BACKEND_URL}/api/v1/${pathString}`
  
  // Get request body if present
  let body: BodyInit | null | undefined
  const contentLength = request.headers.get('content-length')
  
  if (request.method !== 'GET' && request.method !== 'HEAD' && contentLength && parseInt(contentLength) > 0) {
    // Read as ArrayBuffer to safely handle binary data (files) without needing stream configuration
    body = await request.arrayBuffer()
  }

  // Forward headers (excluding host and connection)
  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers.set(key, value)
    }
  })

  // Make request to backend
  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
  })



  // Get response body
  const responseBody = await response.arrayBuffer()

  // Create response with same status
  const nextResponse = new NextResponse(responseBody, {
    status: response.status,
    statusText: response.statusText,
  })

  // Forward headers including Set-Cookie, but exclude problematic ones
  response.headers.forEach((value, key) => {
    if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
      nextResponse.headers.set(key, value)
    }
  })

  return nextResponse
}
