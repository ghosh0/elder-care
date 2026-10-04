'use client'

import React, { useRef, useEffect, useState } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  RotateCcw,
  Sparkles,
  Code,
  Eye,
  Type,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  label?: string
  description?: string
}

const FONT_FAMILIES = [
  { label: 'Default Font', value: 'inherit' },
  { label: 'Serif (Editorial)', value: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  { label: 'Sans-Serif (Modern)', value: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: 'Playfair / Serif Luxury', value: '"Playfair Display", Georgia, serif' },
  { label: 'Monospace (Code)', value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
]

const FONT_SIZES = [
  { label: 'Default Size', value: 'inherit' },
  { label: 'Small (14px)', value: '14px' },
  { label: 'Normal (16px)', value: '16px' },
  { label: 'Medium (18px)', value: '18px' },
  { label: 'Large (22px)', value: '22px' },
  { label: 'Heading 3 (28px)', value: '28px' },
  { label: 'Heading 2 (36px)', value: '36px' },
  { label: 'Heading 1 (48px)', value: '48px' },
]

const HIGHLIGHT_COLORS = [
  { label: 'None', value: 'transparent', bg: '#f1f5f9' },
  { label: 'Yellow', value: '#fef08a', bg: '#fef08a' },
  { label: 'Emerald', value: '#bbf7d0', bg: '#bbf7d0' },
  { label: 'Sky Blue', value: '#bae6fd', bg: '#bae6fd' },
  { label: 'Pink', value: '#fbcfe8', bg: '#fbcfe8' },
  { label: 'Amber', value: '#fed7aa', bg: '#fed7aa' },
  { label: 'Purple', value: '#e9d5ff', bg: '#e9d5ff' },
]

const TEXT_COLORS = [
  { label: 'Default', value: 'inherit', color: '#334155' },
  { label: 'Primary Brand', value: 'hsl(var(--primary))', color: '#0d9488' },
  { label: 'Charcoal Dark', value: '#0f172a', color: '#0f172a' },
  { label: 'Muted Slate', value: '#64748b', color: '#64748b' },
  { label: 'Warm Amber', value: '#b45309', color: '#b45309' },
  { label: 'Rose Red', value: '#e11d48', color: '#e11d48' },
  { label: 'Deep Blue', value: '#1d4ed8', color: '#1d4ed8' },
]

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content here...',
  rows = 4,
  label,
  description,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'visual' | 'code' | 'preview'>('visual')
  const [showHighlightMenu, setShowHighlightMenu] = useState(false)
  const [showColorMenu, setShowColorMenu] = useState(false)
  const savedSelectionRef = useRef<Range | null>(null)

  // Initialize or sync content if external value changed drastically
  useEffect(() => {
    if (editorRef.current && mode === 'visual') {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || ''
      }
    }
  }, [value, mode])

  function saveSelection() {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange()
    }
  }

  function restoreSelection() {
    const sel = window.getSelection()
    if (sel && savedSelectionRef.current) {
      sel.removeAllRanges()
      sel.addRange(savedSelectionRef.current)
    }
  }

  function handleInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  function executeCommand(command: string, arg?: string) {
    if (mode !== 'visual') return
    if (editorRef.current) {
      editorRef.current.focus()
    }
    document.execCommand(command, false, arg)
    handleInput()
  }

  function applyCustomSpanStyle(styleProp: string, styleValue: string) {
    if (mode !== 'visual') return
    restoreSelection()
    const sel = window.getSelection()

    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      if (editorRef.current) editorRef.current.focus()
      return
    }

    const range = sel.getRangeAt(0)
    const selectedContent = range.extractContents()
    const span = document.createElement('span')
    span.style.setProperty(styleProp, styleValue)
    span.appendChild(selectedContent)
    range.insertNode(span)

    sel.removeAllRanges()
    const newRange = document.createRange()
    newRange.selectNodeContents(span)
    sel.addRange(newRange)

    handleInput()
  }

  function applyBrandHighlight() {
    if (mode !== 'visual') return
    restoreSelection()
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) {
      if (editorRef.current) editorRef.current.focus()
      return
    }

    const range = sel.getRangeAt(0)
    const selectedText = range.toString()
    if (!selectedText) {
      // If nothing selected, insert sample styled text
      const span = document.createElement('span')
      span.className = 'text-primary font-bold'
      span.textContent = 'Featured Word'
      range.insertNode(span)
    } else {
      const selectedContent = range.extractContents()
      const span = document.createElement('span')
      span.className = 'text-primary font-bold'
      span.appendChild(selectedContent)
      range.insertNode(span)
    }

    handleInput()
  }

  const minHeightPx = Math.max(100, rows * 28)

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">{label}</label>
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMode('visual')}
              className={`rounded px-2 py-1 font-medium transition-colors ${
                mode === 'visual' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Visual
            </button>
            <button
              type="button"
              onClick={() => setMode('code')}
              className={`rounded px-2 py-1 font-medium transition-colors ${
                mode === 'code' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code className="inline h-3 w-3 mr-1" />
              HTML
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`rounded px-2 py-1 font-medium transition-colors ${
                mode === 'preview' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="inline h-3 w-3 mr-1" />
              Preview
            </button>
          </div>
        </div>
      )}

      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10">
        {/* Toolbar */}
        {mode === 'visual' && (
          <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2 text-muted-foreground">
            {/* Font Family selector */}
            <div className="relative">
              <select
                aria-label="Font Family"
                onChange={(e) => {
                  if (e.target.value !== 'inherit') {
                    applyCustomSpanStyle('font-family', e.target.value)
                  }
                  e.target.value = 'inherit'
                }}
                className="h-8 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                defaultValue="inherit"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.label} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size selector */}
            <div className="relative">
              <select
                aria-label="Font Size"
                onChange={(e) => {
                  if (e.target.value !== 'inherit') {
                    applyCustomSpanStyle('font-size', e.target.value)
                  }
                  e.target.value = 'inherit'
                }}
                className="h-8 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                defaultValue="inherit"
              >
                {FONT_SIZES.map((s) => (
                  <option key={s.label} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-4 w-px bg-border mx-1" />

            {/* Bold */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Bold (Ctrl+B)"
              onClick={() => executeCommand('bold')}
            >
              <Bold className="h-4 w-4" />
            </Button>

            {/* Italic */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Italic (Ctrl+I)"
              onClick={() => executeCommand('italic')}
            >
              <Italic className="h-4 w-4" />
            </Button>

            {/* Underline */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Underline (Ctrl+U)"
              onClick={() => executeCommand('underline')}
            >
              <Underline className="h-4 w-4" />
            </Button>

            {/* Strikethrough */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Strikethrough"
              onClick={() => executeCommand('strikeThrough')}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>

            <div className="h-4 w-px bg-border mx-1" />

            {/* Highlight color picker */}
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs gap-1"
                title="Highlight Background"
                onMouseDown={saveSelection}
                onClick={() => {
                  setShowHighlightMenu(!showHighlightMenu)
                  setShowColorMenu(false)
                }}
              >
                <Highlighter className="h-3.5 w-3.5 text-amber-500" />
                <span className="hidden sm:inline">Highlight</span>
              </Button>

              {showHighlightMenu && (
                <div className="absolute left-0 top-9 z-50 flex gap-1.5 rounded-lg border border-border bg-popover p-2 shadow-lg">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      title={c.label}
                      className="h-6 w-6 rounded-full border border-border shadow-xs transition-transform hover:scale-110"
                      style={{ backgroundColor: c.bg }}
                      onClick={() => {
                        applyCustomSpanStyle('background-color', c.value)
                        setShowHighlightMenu(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Text color picker */}
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs gap-1"
                title="Text Color"
                onMouseDown={saveSelection}
                onClick={() => {
                  setShowColorMenu(!showColorMenu)
                  setShowHighlightMenu(false)
                }}
              >
                <Palette className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">Color</span>
              </Button>

              {showColorMenu && (
                <div className="absolute left-0 top-9 z-50 flex gap-1.5 rounded-lg border border-border bg-popover p-2 shadow-lg">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      title={c.label}
                      className="h-6 w-6 rounded-full border border-border shadow-xs transition-transform hover:scale-110"
                      style={{ backgroundColor: c.color }}
                      onClick={() => {
                        applyCustomSpanStyle('color', c.value)
                        setShowColorMenu(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Brand Color Shortcut */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              title="Apply Brand Color & Bold"
              onMouseDown={saveSelection}
              onClick={applyBrandHighlight}
            >
              <Sparkles className="h-3 w-3" />
              Brand Accent
            </Button>

            <div className="h-4 w-px bg-border mx-1" />

            {/* Alignment */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Align Left"
              onClick={() => executeCommand('justifyLeft')}
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Align Center"
              onClick={() => executeCommand('justifyCenter')}
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Align Right"
              onClick={() => executeCommand('justifyRight')}
            >
              <AlignRight className="h-3.5 w-3.5" />
            </Button>

            {/* Lists */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Bullet List"
              onClick={() => executeCommand('insertUnorderedList')}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Numbered List"
              onClick={() => executeCommand('insertOrderedList')}
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </Button>

            {/* Clear formatting */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              title="Clear Formatting"
              onClick={() => executeCommand('removeFormat')}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Content area */}
        {mode === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            data-placeholder={placeholder}
            className="p-4 outline-none text-foreground text-sm leading-relaxed prose prose-sm max-w-none focus:ring-0 empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
            style={{ minHeight: `${minHeightPx}px` }}
          />
        )}

        {mode === 'code' && (
          <div className="p-2">
            <textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full font-mono text-xs p-3 rounded-lg border border-border bg-muted/20 text-foreground outline-none focus:ring-1 focus:ring-primary"
              style={{ minHeight: `${minHeightPx}px` }}
              rows={rows + 2}
              placeholder="Enter raw HTML code here..."
            />
          </div>
        )}

        {mode === 'preview' && (
          <div
            className="p-6 bg-background text-foreground border-t border-border"
            style={{ minHeight: `${minHeightPx}px` }}
          >
            <div className="text-xs uppercase font-semibold text-muted-foreground mb-2">Live Rendered Output:</div>
            <div
              className="rich-text-content border border-dashed border-border rounded-lg p-4 bg-muted/10 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: value || '<em class="text-muted-foreground">No content to preview</em>' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
