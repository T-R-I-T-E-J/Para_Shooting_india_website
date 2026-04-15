'use client'

import { useRef, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Toolbar button
// ---------------------------------------------------------------------------

function TBtn({
  onActivate,
  title,
  children,
}: {
  onActivate: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onActivate}
      className="h-7 px-2 text-[11px] font-semibold rounded transition-colors cursor-pointer select-none text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 flex items-center justify-center gap-1"
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
}

// ---------------------------------------------------------------------------
// Component
// Toolbar buttons insert/wrap HTML tags at cursor position in the textarea.
// Content is a raw HTML string — safe because it is admin-authored and
// rendered on the public site via SanitizedHtml (DOMPurify).
// ---------------------------------------------------------------------------

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your article content here… (HTML supported)',
  minHeight = '400px',
}: RichTextEditorProps) {
  const taRef = useRef<HTMLTextAreaElement>(null)

  // Wrap selected text with an HTML tag
  const wrapTag = useCallback(
    (tag: string, extraAttrs?: string) => {
      const ta = taRef.current
      if (!ta) return
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const selected = value.slice(start, end)
      const attrs = extraAttrs ? ` ${extraAttrs}` : ''
      const wrapped = `<${tag}${attrs}>${selected}</${tag}>`
      const next = value.slice(0, start) + wrapped + value.slice(end)
      onChange(next)
      // Restore cursor inside the closing tag
      setTimeout(() => {
        ta.focus()
        const cursorEnd = start + wrapped.length - tag.length - 3
        ta.setSelectionRange(start + tag.length + attrs.length + 2, cursorEnd)
      }, 0)
    },
    [value, onChange],
  )

  // Insert a snippet at the cursor (for block elements like headings, lists)
  const insertAt = useCallback(
    (snippet: string, cursorOffset = 0) => {
      const ta = taRef.current
      if (!ta) return
      const pos = ta.selectionStart
      const next = value.slice(0, pos) + snippet + value.slice(pos)
      onChange(next)
      setTimeout(() => {
        ta.focus()
        const target = pos + snippet.length - cursorOffset
        ta.setSelectionRange(target, target)
      }, 0)
    },
    [value, onChange],
  )

  // Wrap selected text in heading or paragraph block
  const wrapBlock = useCallback(
    (tag: string) => {
      const ta = taRef.current
      if (!ta) return
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const selected = value.slice(start, end).trim() || `${tag} text`
      const block = `\n<${tag}>${selected}</${tag}>\n`
      const next = value.slice(0, start) + block + value.slice(end)
      onChange(next)
      setTimeout(() => {
        ta.focus()
        ta.setSelectionRange(start + block.length, start + block.length)
      }, 0)
    },
    [value, onChange],
  )

  // Upload an image file and insert <img> tag at cursor
  const uploadAndInsertImage = useCallback(
    async (file: File | undefined) => {
      if (!file) return
      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/v1/upload/file', {
          method: 'POST',
          credentials: 'include',
          body: fd,
        })
        if (!res.ok) throw new Error(`Upload error ${res.status}`)
        const json = await res.json()
        const url: string | undefined = json?.data?.file?.url
        if (!url) throw new Error('No URL in response')
        insertAt(`\n<img src="${url}" alt="" />\n`)
      } catch {
        alert('Image upload failed. Please try again.')
      }
    },
    [insertAt],
  )

  const insertLink = useCallback(() => {
    const ta = taRef.current
    if (!ta) return
    const selected = value.slice(ta.selectionStart, ta.selectionEnd) || 'link text'
    const url = window.prompt('Enter URL:')
    if (!url) return
    wrapTag('a', `href="${url}"`)
  }, [value, wrapTag])

  return (
    <div className="border border-neutral-300 focus-within:border-primary/60 transition-colors bg-white">
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-neutral-200 bg-neutral-50">

        {/* Text formatting */}
        <TBtn onActivate={() => wrapTag('strong')} title="Bold"><strong>B</strong></TBtn>
        <TBtn onActivate={() => wrapTag('em')} title="Italic"><em>I</em></TBtn>
        <TBtn onActivate={() => wrapTag('u')} title="Underline"><u>U</u></TBtn>

        <div className="w-px h-5 bg-neutral-200 mx-1 flex-shrink-0" />

        {/* Blocks */}
        <TBtn onActivate={() => wrapBlock('h2')} title="Heading 2">H2</TBtn>
        <TBtn onActivate={() => wrapBlock('h3')} title="Heading 3">H3</TBtn>
        <TBtn onActivate={() => wrapBlock('p')} title="Paragraph">P</TBtn>

        <div className="w-px h-5 bg-neutral-200 mx-1 flex-shrink-0" />

        {/* Lists */}
        <TBtn onActivate={() => insertAt('\n<ul>\n  <li></li>\n</ul>\n', 10)} title="Bullet list">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
            <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/>
          </svg>
        </TBtn>
        <TBtn onActivate={() => insertAt('\n<ol>\n  <li></li>\n</ol>\n', 10)} title="Numbered list">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
          </svg>
        </TBtn>

        <div className="w-px h-5 bg-neutral-200 mx-1 flex-shrink-0" />

        {/* Link */}
        <TBtn onActivate={insertLink} title="Insert link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
          </svg>
        </TBtn>

        {/* Inline image */}
        <label title="Insert image into content" className="h-7 px-2 flex items-center text-neutral-600 hover:bg-neutral-200 rounded transition-colors cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { uploadAndInsertImage(e.target.files?.[0]); e.target.value = '' }}
          />
        </label>

        <div className="w-px h-5 bg-neutral-200 mx-1 flex-shrink-0" />

        {/* Blockquote */}
        <TBtn onActivate={() => wrapBlock('blockquote')} title="Blockquote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
          </svg>
        </TBtn>
      </div>

      {/* ── Textarea (stores raw HTML) ──────────────────────────────────── */}
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ minHeight, resize: 'vertical' }}
        spellCheck={false}
        className="w-full p-4 outline-none text-neutral-800 text-[13px] leading-[1.8] font-mono bg-white placeholder-neutral-400"
      />

      {/* Help hint */}
      <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
        <p className="text-[11px] text-neutral-400">
          Use toolbar to insert HTML tags. You can also type HTML directly.
        </p>
        <span className="text-[11px] text-neutral-400">
          {value.length} chars
        </span>
      </div>
    </div>
  )
}
