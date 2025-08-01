import type { FileWithPreview } from '../types/config'

// Serialize FileWithPreview for localStorage
export function serializeFile(file: FileWithPreview): any {
  return {
    id: file.id,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    preview: file.preview,
    status: file.status,
    progress: file.progress,
    error: file.error
  }
}

// Deserialize FileWithPreview from localStorage
export function deserializeFile(fileData: any): FileWithPreview {
  // Create a new File object from the stored data
  const file = new File([], fileData.name, {
    type: fileData.type,
    lastModified: fileData.lastModified
  }) as FileWithPreview

  // Restore the additional properties
  file.id = fileData.id
  file.preview = fileData.preview
  file.status = fileData.status
  file.progress = fileData.progress
  file.error = fileData.error

  return file
}

// Save files to localStorage
export function saveFilesToStorage(files: FileWithPreview[], key: string): void {
  try {
    const serializedFiles = files.map(serializeFile)
    localStorage.setItem(key, JSON.stringify(serializedFiles))
  } catch (error) {
    console.error('Error saving files to localStorage:', error)
  }
}

// Load files from localStorage
export function loadFilesFromStorage(key: string): FileWithPreview[] {
  try {
    const savedData = localStorage.getItem(key)
    if (savedData) {
      const serializedFiles = JSON.parse(savedData)
      return serializedFiles.map(deserializeFile)
    }
  } catch (error) {
    console.error('Error loading files from localStorage:', error)
  }
  return []
}

// Clear files from localStorage
export function clearFilesFromStorage(key: string): void {
  localStorage.removeItem(key)
} 