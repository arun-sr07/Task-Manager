// Sanitize input to prevent HTML/script injection
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  // Remove any HTML tags and script-related patterns
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

// Validate that string doesn't contain dangerous patterns
export function containsDangerousPatterns(input: string): boolean {
  if (typeof input !== "string") {
    return false;
  }

  const dangerousPatterns = [
    /<script/i,
    /<\/script/i,
    /javascript:/i,
    /on\w+=/i,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(input));
}
