export function minifyHTML(html: string): string {
  // Removes multi-space and newlines between tags and trim the result
  return html
    .replace(/\s+</g, "<")
    .replace(/>[\s\n]+</g, "><")
    .trim();
}
