/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Shared UI Utilities                            │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Module : src/components/ui.tsx                             │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Reusable UI components and formatting helpers used across
 * multiple pages (browse, docs, series detail, etc.).
 */

'use client';

// ==================== FORMATTING HELPERS ====================
// ---- FEATURE: FORMAT VIEWS ----

/**
 * Format a view count into a human-readable string with suffixes.
 *
 * @param views - Raw view count number
 * @returns     - Formatted string (e.g. "1.2M", "45.3K", "890")
 */
export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
}

// ---- FEATURE: FORMAT DATE ----

/**
 * Format an ISO date string into a relative time string.
 *
 * @param dateStr - ISO 8601 date string
 * @returns       - Relative time (e.g. "2d ago", "3h ago", "Just now")
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

// ==================== COMPONENTS ====================
// ---- FEATURE: SPINNER ----

/**
 * Loading spinner component with consistent styling.
 */
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#2a2a36] border-t-[#ef4444] rounded-full animate-spin" />
    </div>
  );
}

// ---- FEATURE: CODE BLOCK ----

/**
 * Syntax-highlighted code block for documentation and API examples.
 *
 * @param code     - Code string to display
 * @param language - Language label (e.g. "json", "javascript", "bash")
 */
export function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="code-block">
      <pre>
        <code className={language ? `language-${language}` : ''}>
          {code}
        </code>
      </pre>
    </div>
  );
}

// ---- FEATURE: COPY BUTTON ----

/**
 * Copy-to-clipboard button with feedback animation.
 *
 * @param text - Text to copy to clipboard
 */
export function CopyBtn({ text }: { text: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <button
      onClick={handleCopy}
      className="copy-btn"
      title="Copy to clipboard"
    >
      Copy
    </button>
  );
}

// ==================== EOF ====================
