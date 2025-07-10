export interface ReasonParts {
  title: string | null;
  description: string;
}

/**
 * Extracts a title and description from a reason string formatted as
 * "**Title:** Description". If the pattern isn't found, the entire string is
 * returned as the description and title will be null.
 */
export function extractReasonCategory(reason: string): ReasonParts {
  const match = reason.match(/\*\*(.+?):\*\*\s*(.+)/);
  if (match) {
    return { title: match[1].trim(), description: match[2].trim() };
  }
  return { title: null, description: reason.trim() };
}
