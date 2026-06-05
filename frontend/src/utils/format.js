export function formatDate(value) {
  if (!value) return "Unknown";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function splitSkills(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];

  return String(value)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(" ");
  }

  return detail || error?.message || fallback;
}
