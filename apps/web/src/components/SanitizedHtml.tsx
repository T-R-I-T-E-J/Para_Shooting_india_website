import sanitizeHtml from 'sanitize-html';

interface SanitizedHtmlProps {
  html: string;
  className?: string;
}

const defaultOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'img', 'h1', 'h2', 'span', 'br', 'div', 'p', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'style'
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    'a': ['href', 'name', 'target', 'rel', 'title'],
    'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
    '*': ['class', 'id', 'style']
  },
  allowedStyles: {
    '*': {
      'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/i, /^hsl\(/i],
      'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/i, /^hsl\(/i],
      'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
      'font-size': [/^\d+(?:px|em|rem||%)$/],
      'width': [/^\d+(?:px|em|rem|%)$/],
      'height': [/^\d+(?:px|em|rem|%)$/],
      'padding': [/^\d+(?:px|em|rem|%)$/],
      'margin': [/^\d+(?:px|em|rem|%)$/]
    }
  }
};

export default function SanitizedHtml({ html, className }: SanitizedHtmlProps) {
  // sanitize-html works correctly on both server (build time) and client side
  // without needing a complex emulator like JSDOM.
  const sanitized = sanitizeHtml(html || '', defaultOptions);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }} 
    />
  );
}
