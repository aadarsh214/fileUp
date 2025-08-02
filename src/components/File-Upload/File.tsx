import React, { useState, useRef, useCallback } from 'react'
import { cn, formatFileSize, getFileIcon } from '../../lib/utils'

interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void
  multiple?: boolean
  accept?: string
  maxSize?: number // in bytes
  className?: string
}

interface FileWithPreview extends File {
  id: string
  preview?: string
  status: 'uploading' | 'success' | 'error'
  progress?: number
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  multiple = true,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  // const [uploading, setUploading] = useState(false) // Removed unused variable
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`
    }
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const fileType = file.type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type
        }
        return fileType === type || fileType.startsWith(type.replace('*', ''))
      })
      
      if (!isAccepted) {
        return `File type ${file.type} is not accepted`
      }
    }
    return null
  }

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: FileWithPreview[] = []
    const errors: string[] = []

    Array.from(fileList).forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
        return
      }

      const fileWithPreview: FileWithPreview = {
        ...file,
        id: Math.random().toString(36).substr(2, 9),
        status: 'uploading',
        progress: 0
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFiles(prev => prev.map(f => 
            f.id === fileWithPreview.id 
              ? { ...f, preview: e.target?.result as string }
              : f
          ))
        }
        reader.readAsDataURL(file)
      }

      newFiles.push(fileWithPreview)
    })

    if (errors.length > 0) {
      alert(errors.join('\n'))
    }

    if (newFiles.length > 0) {
      setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles)
      onFilesSelected?.(newFiles)
    }
  }, [multiple, accept, maxSize, onFilesSelected])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      processFiles(fileList)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const fileList = event.dataTransfer.files
    if (fileList) {
      processFiles(fileList)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const simulateUpload = (file: FileWithPreview) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'success', progress: 100 }
            : f
        ))
      } else {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, progress }
            : f
        ))
      }
    }, 200)
  }

  return (
    <div className={cn("w-full", className)}>
      {/* File Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragOver 
            ? "border-primary bg-primary/5" 
            : "border-neutral-300 hover:border-primary/50",
          "bg-card"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-lg font-medium text-foreground">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {accept ? `Accepted types: ${accept}` : 'All file types accepted'}
            </p>
            <p className="text-sm text-muted-foreground">
              Max size: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-medium text-foreground">Selected Files</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-card border border-neutral-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                    {file.status === 'uploading' && file.progress !== undefined && (
                      <div className="mt-1">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round(file.progress)}% uploaded
                        </p>
                      </div>
                    )}
                    {file.status === 'success' && (
                      <p className="text-xs text-green-600 mt-1">✓ Uploaded successfully</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.status === 'uploading' && (
                    <button
                      onClick={() => simulateUpload(file)}
                      className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                      Upload
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
