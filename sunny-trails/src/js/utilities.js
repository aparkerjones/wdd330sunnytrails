export function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

export function safeText(value, fallback = "") {
  return value == null ? fallback : String(value);
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
