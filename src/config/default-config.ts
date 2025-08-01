import type { FileUploadConfig } from '../types/config'

export const defaultConfig: FileUploadConfig = {
  // Variant configuration
  variant: 'dropzone',
  size: 'md',
  theme: 'default',
  
  // File restrictions
  maxSize: 10 * 1024 * 1024, // 10MB
  acceptedTypes: [
    'image/*',
    'video/*',
    'audio/*',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.txt',
    '.zip',
    '.rar'
  ],
  multiple: true,
  maxFiles: 10,
  
  // Styling
  radius: 'md',
  borderStyle: 'dashed',
  iconPlacement: 'center',
  
  // Labels and text
  labels: {
    title: 'Upload Files',
    subtitle: 'Drag and drop files here or click to browse',
    buttonText: 'Choose Files',
    dragText: 'Drag files here',
    dropText: 'Drop files here',
    errorText: 'Error uploading file',
    successText: 'File uploaded successfully'
  },
  
  // Behavior
  autoUpload: false,
  showProgress: true,
  showPreview: true,
  allowRemove: true,
  
  // Accessibility
  ariaLabel: 'File upload area',
  ariaDescribedBy: undefined
}

// Preset configurations for common use cases
export const configPresets = {
  imageOnly: {
    ...defaultConfig,
    variant: 'preview' as const,
    acceptedTypes: ['image/*'],
    labels: {
      ...defaultConfig.labels,
      title: 'Upload Images',
      subtitle: 'Drag and drop images here or click to browse'
    }
  },
  
  documentOnly: {
    ...defaultConfig,
    variant: 'button' as const,
    acceptedTypes: ['.pdf', '.doc', '.docx', '.txt'],
    labels: {
      ...defaultConfig.labels,
      title: 'Upload Documents',
      subtitle: 'Select PDF, Word, or text files'
    }
  },
  
  compact: {
    ...defaultConfig,
    variant: 'compact' as const,
    size: 'sm' as const,
    showPreview: false,
    labels: {
      ...defaultConfig.labels,
      title: 'Quick Upload',
      subtitle: 'Click to select files'
    }
  },
  
  modern: {
    ...defaultConfig,
    theme: 'modern' as const,
    variant: 'dropzone' as const,
    labels: {
      ...defaultConfig.labels,
      title: 'Upload Your Files',
      subtitle: 'Drop files here or click to browse'
    }
  }
} as const 