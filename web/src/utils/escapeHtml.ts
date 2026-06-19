export function escapeHtml(input: unknown) {
  if (input === null || input === undefined) return "";

  const str = String(input);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Usage: when rendering user-provided strings in contexts that could be
// interpreted as HTML. Prefer rendering as text rather than innerHTML.
