import React from 'react'

interface RichHtmlProps {
  content: string
  className?: string
  as?: React.ElementType
}

export function RichHtml({
  content,
  className = '',
  as: Component = 'div',
}: RichHtmlProps) {
  if (!content) return null

  return (
    <Component
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
