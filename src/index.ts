// Main exports
export { FileUpload } from './components/file-upload'
export { FileUploadButton } from './components/file-upload-button'
export { FileUploadDropzone } from './components/file-upload-dropzone'
export { FileUploadPreview } from './components/file-upload-preview'

// Types
export type { FileUploadProps } from './components/file-upload'
export type { FileUploadConfig } from './types/config'
export type { FileUploadVariant, FileUploadSize, FileUploadTheme } from './types/variants'

// Utilities
export { createFileUploadConfig, getConfigFromJSON, exportConfigToJSON } from './utils/config'
export { formatFileSize, getFileIcon } from './lib/utils'
export { saveFilesToStorage, loadFilesFromStorage, clearFilesFromStorage } from './utils/storage'

// Default config
export { defaultConfig, configPresets } from './config/default-config' 