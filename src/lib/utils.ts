import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileIcon(fileType: string): string {
  const typeMap: Record<string, string> = {
    'image': '🖼️',
    'video': '🎥',
    'audio': '🎵',
    'text': '📄',
    'pdf': '📕',
    'zip': '📦',
    'doc': '📘',
    'xls': '📊',
    'ppt': '📋',
    'default': '📎'
  }
  
  if (fileType.startsWith('image/')) return typeMap.image
  if (fileType.startsWith('video/')) return typeMap.video
  if (fileType.startsWith('audio/')) return typeMap.audio
  if (fileType.startsWith('text/')) return typeMap.text
  if (fileType === 'application/pdf') return typeMap.pdf
  if (fileType.includes('zip') || fileType.includes('rar')) return typeMap.zip
  if (fileType.includes('word') || fileType.includes('document')) return typeMap.doc
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return typeMap.xls
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return typeMap.ppt
  
  return typeMap.default
} 