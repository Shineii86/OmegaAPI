/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Route Utilities                                │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Module : src/lib/utils.ts                                 │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Shared helpers for Next.js API route handlers:
 * - Client IP extraction from proxy headers
 * - CORS header generation
 * - Standardized success/error response builders
 */

import { NextRequest, NextResponse } from 'next/server';

// ==================== IP EXTRACTION ====================
// ---- FEATURE: CLIENT IP ----

/**
 * Extract the client IP address from the request.
 *
 * NOTE: On Vercel, the real IP is in x-forwarded-for (first entry)
 * or x-real-ip. Falls back to 127.0.0.1 for local development.
 *
 * @param req - Next.js request object
 * @returns   - Client IP address string
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

// ==================== CORS ====================
// ---- FEATURE: CORS ----

/**
 * Generate standard CORS headers for public API access.
 *
 * NOTE: Allows all origins (*) since this is a public API.
 * Only GET and OPTIONS are permitted (no mutations).
 *
 * @returns - Record of CORS header key-value pairs
 */
export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// ==================== RESPONSE BUILDERS ====================
// ---- FEATURE: RESPONSE BUILDERS ----

/**
 * Build a standardized success response.
 *
 * @param data          - Response payload (any JSON-serializable value)
 * @param status        - HTTP status code (default: 200)
 * @param extraHeaders  - Additional headers to merge (e.g. rate limit info)
 * @returns             - NextResponse with JSON body and standard headers
 *
 * NOTE: Every response includes a unique X-Request-ID for tracing.
 */
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

// ---- FEATURE: PAGINATION HEADERS ----

/**
 * Build pagination metadata headers for paginated responses.
 *
 * @param pagination - Pagination object from PaginatedResponse
 * @returns          - Record of X-Pagination-* headers
 *
 * NOTE: These headers allow API consumers to read pagination
 * metadata without parsing the JSON body (useful for HEAD
 * requests and automated tooling).
 */
export function paginationHeaders(pagination: {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}): Record<string, string> {
  return {
    'X-Pagination-Total': String(pagination.total),
    'X-Pagination-Per-Page': String(pagination.perPage),
    'X-Pagination-Current-Page': String(pagination.currentPage),
    'X-Pagination-Last-Page': String(pagination.lastPage),
    'X-Pagination-Has-Next': String(pagination.hasNext),
    'X-Pagination-Has-Previous': String(pagination.hasPrevious),
  };
}

/**
 * Build a standardized error response.
 *
 * @param message - Human-readable error message
 * @param status  - HTTP status code (default: 500)
 * @param extra   - Additional fields to include in the error body
 * @returns       - NextResponse with error envelope and standard headers
 */
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

// ==================== EOF ====================
