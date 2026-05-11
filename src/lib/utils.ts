import { NextRequest, NextResponse } from 'next/server';

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export function successResponse<T>(
  data: T,
  status = 200,
  extraHeaders: Record<string, string> = {}
): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      ...corsHeaders(),
      'X-Request-ID': crypto.randomUUID(),
      ...extraHeaders,
    },
  });
}

export function errorResponse(
  message: string,
  status = 500,
  extra: Record<string, unknown> = {}
): NextResponse {
  return NextResponse.json(
    { success: false, error: message, ...extra },
    {
      status,
      headers: {
        ...corsHeaders(),
        'X-Request-ID': crypto.randomUUID(),
      },
    }
  );
}
