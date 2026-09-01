/**
 * Safely decodes HTML entities (e.g., &amp;, &#39;, &quot;, &lt;, &gt;) into plain text.
 * Prevents XSS vulnerabilities while properly displaying encoded characters in external API responses.
 */
export const decodeHtmlEntities = (text: string | null | undefined): string => {
  if (!text) return '';

  const entityMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&#x2F;': '/',
    '&#47;': '/',
    '&#x60;': '`',
    '&#96;': '`',
  };

  return text
    .replace(/&(?:amp|lt|gt|quot|#39|apos|#x2F|#47|#x60|#96);/g, (match) => entityMap[match] || match)
    .replace(/&#(\d+);/g, (_, dec) => {
      try {
        return String.fromCharCode(parseInt(dec, 10));
      } catch {
        return _;
      }
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch {
        return _;
      }
    });
};
