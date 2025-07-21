export function simplifyCategory(category: string): string {
  if (!category) return '';
  return category.toLowerCase().split(/\s+/)[0];
}
