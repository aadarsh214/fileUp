import React, { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '../lib/utils'
import { formatFileSize, getFileIcon } from '../lib/utils'
import type { FileUploadConfig, FileWithPreview } from '../types/config'
import { variantStyles, themeStyles } from '../types/variants'
import { defaultConfig } from '../config/default-config'
import { saveFilesToStorage, loadFilesFromStorage } from '../utils/storage'

export interface FileUploadProps {
  config?: Partial<FileUploadConfig>
  onFilesSelected?: (files: File[]) => void
  onFileUpload?: (file: FileWithPreview) => Promise<void>
  onFileRemove?: (fileId: string) => void
  className?: string
  disabled?: boolean
  storageKey?: string // For localStorage
}

export const FileUpload: React.FC<FileUploadProps> = ({
  config: configOverrides = {},
  onFilesSelected,
  onFileUpload,
  onFileRemove,
  className,
  disabled = false,
  storageKey = 'fileUpload'
}) => {
  const config = { ...defaultConfig, ...configOverrides }
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load files from localStorage on component mount
  useEffect(() => {
    const savedFiles = loadFilesFromStorage(storageKey)
    setFiles(savedFiles)
  }, [storageKey])

  // Save files to localStorage whenever files change
  useEffect(() => {
    saveFilesToStorage(files, storageKey)
  }, [files, storageKey])

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (config.maxSize && file.size > config.maxSize) {
      return `${file.name} is too large. Maximum size is ${formatFileSize(config.maxSize)}`
    }

    // Check file type
    if (config.acceptedTypes.length > 0) {
      const fileType = file.type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      const isAccepted = config.acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type
        }
        return fileType === type || fileType.startsWith(type.replace('*', ''))
      })
      
      if (!isAccepted) {
        return `${file.name} is not an accepted file type`
      }
    }

    // Check max files
    if (!config.multiple && files.length >= 1) {
      return 'Only one file is allowed'
    }

    if (config.maxFiles && files.length >= config.maxFiles) {
      return `Maximum ${config.maxFiles} files allowed`
    }

    return null
  }, [config, files.length])

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        resolve('')
      }
    })
  }

  const processFiles = useCallback(async (fileList: FileList) => {
    const newFiles: FileWithPreview[] = []
    const errors: string[] = []

    for (const file of Array.from(fileList)) {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
        continue
      }

      const fileWithPreview: FileWithPreview = {
        ...file,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        progress: 0
      }

      // Create preview for images
      if (file.type.startsWith('image/') && config.showPreview) {
        try {
          const preview = await createFilePreview(file)
          fileWithPreview.preview = preview
        } catch (error) {
          console.error('Error creating preview:', error)
        }
      }

      newFiles.push(fileWithPreview)
    }

    if (errors.length > 0) {
      setError(errors.join('\n'))
      setTimeout(() => setError(undefined), 5000)
    }

    if (newFiles.length > 0) {
      const updatedFiles = config.multiple ? [...files, ...newFiles] : newFiles
      setFiles(updatedFiles)
      onFilesSelected?.(newFiles)

      // Auto upload if enabled
      if (config.autoUpload && onFileUpload) {
        for (const file of newFiles) {
          await handleFileUpload(file)
        }
      }
    }
  }, [config, files, validateFile, onFilesSelected, onFileUpload])

  const handleFileUpload = async (file: FileWithPreview) => {
    if (!onFileUpload) return

    // Prevent any default behavior that might cause page issues
    event?.preventDefault?.()
    event?.stopPropagation?.()

    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
    ))

    let progressInterval: number | null = null

    try {
      // Simulate upload progress
      progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id && f.status === 'uploading' && f.progress !== undefined) {
            const newProgress = Math.min(f.progress + Math.random() * 20, 90)
            return { ...f, progress: newProgress }
          }
          return f
        }))
      }, 200)

      // Call the upload function
      await onFileUpload(file)
      
      // Clear interval and update status
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'success', progress: 100 } : f
      ))

      // Save to localStorage after successful upload
      saveFilesToStorage(files, storageKey)
      
    } catch (error) {
      console.error('Upload error:', error)
      
      // Clear interval on error
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'error', error: error as string } : f
      ))
    }
  }

  const handleFileRemove = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
    onFileRemove?.(fileId)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      processFiles(fileList)
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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

  const getVariantComponent = () => {
    const baseClasses = cn(
      'transition-colors cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )

    const variantClass = variantStyles[config.variant][config.size]
    const themeClass = themeStyles[config.theme][config.variant]

    switch (config.variant) {
      case 'button':
        return (
          <button
            type="button"
            className={cn(
              'inline-flex items-center justify-center',
              variantClass,
              themeClass,
              baseClasses
            )}
            onClick={() => !disabled && fileInputRef.current?.click()}
            disabled={disabled}
            aria-label={config.ariaLabel}
          >
            {config.iconPlacement === 'left' && <span className="mr-2">📁</span>}
            {config.labels.buttonText}
            {config.iconPlacement === 'right' && <span className="ml-2">📁</span>}
          </button>
        )

      case 'dropzone':
        return (
          <div className={cn('space-y-4', baseClasses)}>
            <div
              className={cn(
                'text-center backdrop-blur-lg bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-8 transition-all duration-300',
                isDragOver && 'border-lime-500 bg-lime-500/10 scale-105'
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !disabled && fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label={config.ariaLabel}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  !disabled && fileInputRef.current?.click()
                }
              }}
            >
              <div className="space-y-4">
                <div className="text-5xl">📁</div>
                <div>
                  <p className="text-xl font-semibold text-white">
                    {isDragOver ? config.labels.dropText : config.labels.title}
                  </p>
                  <p className="text-gray-300 mt-2">
                    {config.labels.subtitle}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Max size: {formatFileSize(config.maxSize)}
                  </p>
                </div>
              </div>
            </div>

            {/* File Previews */}
            {config.showPreview && files.length > 0 && (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  >
                    {/* Image Preview */}
                    {file.preview && (
                      <div className="relative">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {file.status === 'success' && (
                            <div className="bg-lime-500 text-black px-2 py-1 rounded-full text-xs font-medium">
                              ✓ Uploaded
                            </div>
                          )}
                          {file.status === 'uploading' && (
                            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Uploading...
                            </div>
                          )}
                          {file.status === 'error' && (
                            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Error
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* File Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {!file.preview && <span className="text-2xl">{getFileIcon(file.type)}</span>}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-white">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatFileSize(file.size)}
                            </p>
                            {file.status === 'uploading' && file.progress !== undefined && (
                              <div className="mt-2">
                                <div className="w-full bg-white/10 rounded-full h-2">
                                  <div
                                    className="bg-lime-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${file.progress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  {Math.round(file.progress)}% uploaded
                                </p>
                              </div>
                            )}
                            {file.status === 'success' && (
                              <p className="text-xs text-lime-400 mt-1">✓ {config.labels.successText}</p>
                            )}
                            {file.status === 'error' && (
                              <p className="text-xs text-red-400 mt-1">✗ {file.error || config.labels.errorText}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.status === 'pending' && onFileUpload && (
                            <button
                              onClick={() => handleFileUpload(file)}
                              className="px-3 py-1 text-xs bg-lime-500 text-black font-semibold rounded-xl shadow-md hover:bg-lime-400 hover:shadow-lg transition-all duration-200 hover:scale-105"
                            >
                              Upload
                            </button>
                          )}
                          {config.allowRemove && (
                            <button
                              onClick={() => handleFileRemove(file.id)}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                              aria-label="Remove file"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'preview':
        return (
          <div className={cn('space-y-4', baseClasses)}>
            <div
              className={cn(
                'text-center backdrop-blur-lg bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-6 transition-all duration-300',
                isDragOver && 'border-lime-500 bg-lime-500/10 scale-105'
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !disabled && fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label={config.ariaLabel}
            >
              <div className="space-y-4">
                <div className="text-4xl">📁</div>
                <div>
                  <p className="text-lg font-semibold text-white">
                    {isDragOver ? config.labels.dropText : config.labels.title}
                  </p>
                  <p className="text-gray-300 mt-1">
                    {config.labels.subtitle}
                  </p>
                </div>
              </div>
            </div>
            
            {files.length > 0 && (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  >
                    {/* Image Preview */}
                    {file.preview && (
                      <div className="relative">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {file.status === 'success' && (
                            <div className="bg-lime-500 text-black px-2 py-1 rounded-full text-xs font-medium">
                              ✓ Uploaded
                            </div>
                          )}
                          {file.status === 'uploading' && (
                            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Uploading...
                            </div>
                          )}
                          {file.status === 'error' && (
                            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Error
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* File Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {!file.preview && <span className="text-2xl">{getFileIcon(file.type)}</span>}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-white">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatFileSize(file.size)}
                            </p>
                            {file.status === 'uploading' && file.progress !== undefined && (
                              <div className="mt-2">
                                <div className="w-full bg-white/10 rounded-full h-2">
                                  <div
                                    className="bg-lime-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${file.progress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  {Math.round(file.progress)}% uploaded
                                </p>
                              </div>
                            )}
                            {file.status === 'success' && (
                              <p className="text-xs text-lime-400 mt-1">✓ {config.labels.successText}</p>
                            )}
                            {file.status === 'error' && (
                              <p className="text-xs text-red-400 mt-1">✗ {file.error || config.labels.errorText}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.status === 'pending' && onFileUpload && (
                            <button
                              onClick={() => handleFileUpload(file)}
                              className="px-3 py-1 text-xs bg-lime-500 text-black font-semibold rounded-xl shadow-md hover:bg-lime-400 hover:shadow-lg transition-all duration-200 hover:scale-105"
                            >
                              Upload
                            </button>
                          )}
                          {config.allowRemove && (
                            <button
                              onClick={() => handleFileRemove(file.id)}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                              aria-label="Remove file"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'compact':
        return (
          <div className={cn('flex items-center space-x-2', baseClasses)}>
            <button
              type="button"
              className={cn(
                'inline-flex items-center justify-center',
                variantClass,
                themeClass
              )}
              onClick={() => !disabled && fileInputRef.current?.click()}
              disabled={disabled}
              aria-label={config.ariaLabel}
            >
              {config.labels.buttonText}
            </button>
            {files.length > 0 && (
              <span className="text-sm text-gray-300">
                {files.length} file{files.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {getVariantComponent()}
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={config.multiple}
        accept={config.acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Error message */}
      {error && (
        <div className="mt-2 p-3 backdrop-blur-lg bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
} 