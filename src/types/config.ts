export interface FileUploadConfig {
  // Variant configuration
  variant: 'button' | 'dropzone' | 'preview' | 'compact'
  size: 'sm' | 'md' | 'lg'
  theme: 'default' | 'minimal' | 'modern' | 'classic'
  
  // File restrictions
  maxSize: number // in bytes
  acceptedTypes: string[]
  multiple: boolean
  maxFiles?: number
  
  // Styling
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'none'
  iconPlacement: 'left' | 'right' | 'top' | 'bottom' | 'center'
  
  // Labels and text
  labels: {
    title: string
    subtitle: string
    buttonText: string
    dragText: string
    dropText: string
    errorText: string
    successText: string
  }
  
  // Behavior
  autoUpload: boolean
  showProgress: boolean
  showPreview: boolean
  allowRemove: boolean
  
  // Accessibility
  ariaLabel: string
  ariaDescribedBy?: string
}

export interface FileUploadState {
  files: FileWithPreview[]
  isDragOver: boolean
  isUploading: boolean
  error?: string
}

export interface FileWithPreview extends File {
  id: string
  preview?: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
} 