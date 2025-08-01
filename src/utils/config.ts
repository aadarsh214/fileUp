import type { FileUploadConfig } from '../types/config'
import { defaultConfig } from '../config/default-config'

export function createFileUploadConfig(overrides: Partial<FileUploadConfig> = {}): FileUploadConfig {
  return {
    ...defaultConfig,
    ...overrides,
    labels: {
      ...defaultConfig.labels,
      ...overrides.labels
    }
  }
}

export function validateConfig(config: FileUploadConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Validate maxSize
  if (config.maxSize <= 0) {
    errors.push('maxSize must be greater than 0')
  }
  
  // Validate acceptedTypes
  if (!Array.isArray(config.acceptedTypes) || config.acceptedTypes.length === 0) {
    errors.push('acceptedTypes must be a non-empty array')
  }
  
  // Validate maxFiles when multiple is true
  if (config.multiple && config.maxFiles !== undefined && config.maxFiles <= 0) {
    errors.push('maxFiles must be greater than 0 when multiple is true')
  }
  
  // Validate labels
  if (!config.labels.title?.trim()) {
    errors.push('labels.title is required')
  }
  
  if (!config.labels.subtitle?.trim()) {
    errors.push('labels.subtitle is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function mergeConfigs(base: FileUploadConfig, overrides: Partial<FileUploadConfig>): FileUploadConfig {
  return {
    ...base,
    ...overrides,
    labels: {
      ...base.labels,
      ...overrides.labels
    }
  }
}

export function getConfigFromJSON(jsonString: string): FileUploadConfig | null {
  try {
    const parsed = JSON.parse(jsonString)
    const config = createFileUploadConfig(parsed)
    const validation = validateConfig(config)
    
    if (!validation.isValid) {
      console.error('Invalid config:', validation.errors)
      return null
    }
    
    return config
  } catch (error) {
    console.error('Failed to parse config JSON:', error)
    return null
  }
}

export function exportConfigToJSON(config: FileUploadConfig): string {
  return JSON.stringify(config, null, 2)
} 