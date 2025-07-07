export function sanitizeInput(input: string): string {
  if (!input) return '';
  // Remove script tags and their content
  const withoutScripts = input.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  // Remove all HTML tags
  const withoutTags = withoutScripts.replace(/<[^>]+>/g, '');
  // Escape quotes, backticks and backslashes
  return withoutTags
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .trim();
}
