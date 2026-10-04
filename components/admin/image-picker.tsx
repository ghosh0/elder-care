'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Image as ImageIcon,
  Upload,
  Check,
  Link as LinkIcon,
  RefreshCw,
  FolderOpen,
} from 'lucide-react'
import { toast } from 'sonner'

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
  description?: string
}

interface ImageItem {
  name: string
  url: string
  category: string
}

export function ImagePicker({
  value,
  onChange,
  label,
  description,
}: ImagePickerProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'library' | 'upload' | 'url'>('library')
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [customUrl, setCustomUrl] = useState('')

  useEffect(() => {
    if (open && tab === 'library') {
      fetchImages()
    }
  }, [open, tab])

  async function fetchImages() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/images')
      if (res.ok) {
        const data = await res.json()
        setImages(data.images || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (res.ok && data.url) {
        toast.success('Image uploaded successfully!')
        onChange(data.url)
        setOpen(false)
      } else {
        toast.error(data.error || 'Failed to upload image')
      }
    } catch {
      toast.error('An error occurred during upload')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function handleCustomUrlSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customUrl.trim()) return
    onChange(customUrl.trim())
    setOpen(false)
    toast.success('Image URL selected')
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-semibold text-foreground">{label}</label>}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-border bg-card p-4">
        {/* Preview image */}
        <div className="relative h-24 w-36 overflow-hidden rounded-lg border border-border bg-muted/40 shrink-0">
          {value ? (
            <Image
              src={value}
              alt="Selected preview"
              fill
              className="object-cover"
              sizes="144px"
              unoptimized={value.startsWith('http')}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="h-6 w-6 opacity-40" />
              <span className="text-[10px] mt-1">No image</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-xs font-mono text-muted-foreground truncate" title={value}>
            {value || 'None chosen'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs">
                  <FolderOpen className="h-3.5 w-3.5 text-primary" />
                  Select / Change Image
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">Select Image</DialogTitle>
                </DialogHeader>

                {/* Tabs */}
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Button
                    type="button"
                    variant={tab === 'library' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTab('library')}
                    className="gap-1.5 text-xs"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    Media Library
                  </Button>
                  <Button
                    type="button"
                    variant={tab === 'upload' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTab('upload')}
                    className="gap-1.5 text-xs"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload from Computer
                  </Button>
                  <Button
                    type="button"
                    variant={tab === 'url' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTab('url')}
                    className="gap-1.5 text-xs"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    External URL
                  </Button>

                  {tab === 'library' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={fetchImages}
                      className="ml-auto h-7 w-7 p-0"
                      title="Refresh library"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                  )}
                </div>

                {/* Tab 1: Library */}
                {tab === 'library' && (
                  <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[420px] p-2">
                    {loading ? (
                      <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
                        <RefreshCw className="h-5 w-5 animate-spin mr-2 text-primary" />
                        Loading images...
                      </div>
                    ) : images.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm text-center">
                        <ImageIcon className="h-10 w-10 opacity-30 mb-2" />
                        <p>No images found in library.</p>
                        <p className="text-xs mt-1">Upload an image or add one via URL.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {images.map((img) => {
                          const isSelected = value === img.url
                          return (
                            <button
                              key={img.url}
                              type="button"
                              onClick={() => {
                                onChange(img.url)
                                setOpen(false)
                                toast.success(`Selected image: ${img.name}`)
                              }}
                              className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all hover:border-primary hover:shadow-md ${
                                isSelected
                                  ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                                  : 'border-border bg-card'
                              }`}
                            >
                              <div className="relative aspect-video w-full bg-muted/30">
                                <Image
                                  src={img.url}
                                  alt={img.name}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                  sizes="200px"
                                  unoptimized={img.url.startsWith('http')}
                                />
                                {isSelected && (
                                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                                    <Check className="h-3 w-3 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <div className="p-2">
                                <p className="text-xs font-medium text-foreground truncate" title={img.name}>
                                  {img.name}
                                </p>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {img.category}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Upload */}
                {tab === 'upload' && (
                  <div className="p-6">
                    <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/20 transition-all">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {uploading ? 'Uploading image...' : 'Click to select an image from your device'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports PNG, JPG, WEBP, SVG (Max 10MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                )}

                {/* Tab 3: URL */}
                {tab === 'url' && (
                  <form onSubmit={handleCustomUrlSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="imgUrl">External Image URL</Label>
                      <Input
                        id="imgUrl"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                      />
                    </div>

                    {customUrl && (
                      <div className="relative aspect-video w-full max-w-sm rounded-lg border border-border overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={customUrl}
                          alt="URL preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                      </div>
                    )}

                    <Button type="submit" disabled={!customUrl.trim()} className="w-full">
                      Use Image URL
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive"
                onClick={() => onChange('')}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
