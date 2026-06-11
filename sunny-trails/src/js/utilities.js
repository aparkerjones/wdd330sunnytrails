export function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

export function safeText(value, fallback = "") {
  return value == null ? fallback : String(value);
}
