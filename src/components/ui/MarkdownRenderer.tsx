import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * A safe, lightweight Markdown parser and renderer.
 * Converts markdown formatting (bold, headings, lists, inline code, code blocks)
 * into semantic React elements without using dangerouslySetInnerHTML.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split line-by-line
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let currentListItems: React.ReactNode[] = [];
  let currentListType: 'ul' | 'ol' | null = null;
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  // Helper to parse inline styles like bold and inline code
  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    // Split by ** for bold segments
    const boldParts = text.split(/\*\*(.*?)\*\*/g);
    return boldParts.flatMap((part, index) => {
      const isBold = index % 2 === 1;

      // Split by ` for inline code segments
      const codeParts = part.split(/`(.*?)`/g);
      const rendered = codeParts.map((subPart, subIndex) => {
        const isCode = subIndex % 2 === 1;
        const key = `inline-${index}-${subIndex}`;

        if (isCode) {
          return (
            <code
              key={key}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.85em',
                color: '#c084fc',
              }}
            >
              {subPart}
            </code>
          );
        }
        return subPart;
      });

      if (isBold) {
        return <strong key={`bold-${index}`}>{rendered}</strong>;
      }
      return rendered;
    });
  };

  const flushList = (key: string) => {
    if (currentListItems.length > 0) {
      const listStyle: React.CSSProperties = {
        margin: '8px 0 12px 20px',
        paddingLeft: '0',
      };
      if (currentListType === 'ul') {
        elements.push(
          <ul key={key} style={{ ...listStyle, listStyleType: 'disc' }}>
            {currentListItems}
          </ul>
        );
      } else {
        elements.push(
          <ol key={key} style={listStyle}>
            {currentListItems}
          </ol>
        );
      }
      currentListItems = [];
      currentListType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const key = `block-${i}`;

    // Handle Code Block toggles
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={key}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '12px 16px',
              borderRadius: '8px',
              overflowX: 'auto',
              margin: '12px 0',
              fontFamily: 'monospace',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.875rem',
            }}
          >
            <code style={{ color: '#a78bfa', whiteSpace: 'pre' }}>
              {codeBlockLines.join('\n')}
            </code>
          </pre>
        );
        inCodeBlock = false;
        codeBlockLines = [];
      } else {
        flushList(key);
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      flushList(key);
      elements.push(
        <hr
          key={key}
          style={{
            border: '0',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            margin: '16px 0',
          }}
        />
      );
      continue;
    }

    // Headings: ### Title, ## Title, # Title
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      flushList(key);
      const level = headerMatch[1].length;
      const text = headerMatch[2];
      
      // Map h1-h6 styles nicely for career counselor context
      const headingStyle: React.CSSProperties = {
        margin: '16px 0 8px 0',
        fontWeight: 600,
        color: '#fff',
        letterSpacing: '-0.01em',
        lineHeight: '1.3',
      };
      
      if (level === 1 || level === 2) {
        elements.push(
          <h3 key={key} style={{ ...headingStyle, fontSize: '1.25rem' }}>
            {parseInlineMarkdown(text)}
          </h3>
        );
      } else {
        elements.push(
          <h4 key={key} style={{ ...headingStyle, fontSize: '1.05rem', color: '#c084fc' }}>
            {parseInlineMarkdown(text)}
          </h4>
        );
      }
      continue;
    }

    // Bullet Lists: -, *, •
    const bulletMatch = line.match(/^(\s*)[-*•]\s+(.*)$/);
    if (bulletMatch) {
      if (currentListType !== 'ul') {
        flushList(key);
        currentListType = 'ul';
      }
      const text = bulletMatch[2];
      currentListItems.push(
        <li key={`li-${i}`} style={{ marginBottom: '6px', lineHeight: '1.5' }}>
          {parseInlineMarkdown(text)}
        </li>
      );
      continue;
    }

    // Numbered Lists: 1. or 1)
    const numberMatch = line.match(/^(\s*)\d+[.)]\s+(.*)$/);
    if (numberMatch) {
      if (currentListType !== 'ol') {
        flushList(key);
        currentListType = 'ol';
      }
      const text = numberMatch[2];
      currentListItems.push(
        <li key={`li-${i}`} style={{ marginBottom: '6px', lineHeight: '1.5' }}>
          {parseInlineMarkdown(text)}
        </li>
      );
      continue;
    }

    // Empty Lines or Paragraphs
    if (line.trim() === '') {
      flushList(key);
    } else {
      flushList(key);
      elements.push(
        <p key={key} style={{ marginBottom: '12px', lineHeight: '1.55' }}>
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  }

  // Flush any final active list
  flushList('final-list');

  return <div style={{ display: 'flex', flexDirection: 'column' }}>{elements}</div>;
};
