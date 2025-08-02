import React, { useState } from 'react'
import { FileUpload, defaultConfig, configPresets, getConfigFromJSON, exportConfigToJSON } from '../index'
import type { FileUploadConfig } from '../types/config'
// import { clearFilesFromStorage } from '../utils/storage' // Removed unused import

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_error: any): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(_error: any, _errorInfo: any) {
    console.error('Error caught by boundary:', _error, _errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-4">Something went wrong</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-lime-500 text-black rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  const [currentConfig, setCurrentConfig] = useState<FileUploadConfig>({
    ...defaultConfig,
    variant: 'dropzone',
    theme: 'modern',
    size: 'lg',
    showPreview: true,
    acceptedTypes: ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx', '.txt'],
    labels: {
      ...defaultConfig.labels,
      title: 'Upload Files',
      subtitle: 'Drag and drop files here or click to browse'
    }
  })
  const [configJSON, setConfigJSON] = useState(exportConfigToJSON(currentConfig))
  // const [uploadedFiles, setUploadedFiles] = useState<File[]>([]) // Removed unused variable
  const [activeTab, setActiveTab] = useState<'variants' | 'config'>('variants')
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFilesSelected = (files: File[]) => {
    try {
      console.log('Files selected:', files)
      setUploadError(null) // Clear any previous errors
    } catch (error) {
      console.error('Error handling files:', error)
      setUploadError('Error processing files')
    }
  }

  const handleConfigChange = (newConfig: FileUploadConfig) => {
    try {
      setCurrentConfig(newConfig)
      setConfigJSON(exportConfigToJSON(newConfig))
    } catch (error) {
      console.error('Error updating config:', error)
    }
  }

  const handleJSONChange = (jsonString: string) => {
    try {
      setConfigJSON(jsonString)
      const parsedConfig = getConfigFromJSON(jsonString)
      if (parsedConfig) {
        setCurrentConfig(parsedConfig)
      }
    } catch (error) {
      console.error('Error parsing JSON:', error)
    }
  }

  const applyPreset = (presetName: keyof typeof configPresets) => {
    try {
      const preset = {
        ...configPresets[presetName],
        acceptedTypes: [...configPresets[presetName].acceptedTypes],
        labels: { ...configPresets[presetName].labels }
      }
      handleConfigChange(preset)
    } catch (error) {
      console.error('Error applying preset:', error)
    }
  }

  const mockUpload = async (file: any) => {
    try {
      // Simulate upload delay with progress
      console.log('Uploading file:', file.name)
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Upload completed for:', file.name)
      setUploadError(null) // Clear any previous errors
      return Promise.resolve()
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(`Failed to upload ${file.name}`)
      throw error
    }
  }

  // const clearAllData = () => {
  //   try {
  //     clearFilesFromStorage('fileUpload')
  //     setUploadError(null)
  //   } catch (error) {
  //     console.error('Error clearing data:', error)
  //   }
  // }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-lime-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-lime-400 to-lime-600 bg-clip-text text-transparent">
                File Upload Component Library
              </h1>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                A config-driven, accessible file upload component with multiple variants, themes, and real-time configuration editing.
              </p>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="mb-6 backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <p className="text-red-400 font-medium">⚠️ {uploadError}</p>
              </div>
            )}

                      {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('variants')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  activeTab === 'variants' 
                    ? 'bg-lime-500 text-black font-medium' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                All Variants
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  activeTab === 'config' 
                    ? 'bg-lime-500 text-black font-medium' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Config Editor
              </button>
            </div>
          </div>

            {/* Tab Content */}
            {activeTab === 'variants' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">All Variants</h2>
                
                {/* Button Variants */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-lime-400 mb-6">Button Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Default Button</h4>
                      <FileUpload
                        config={{
                          variant: 'button',
                          size: 'md',
                          theme: 'default',
                          labels: { ...defaultConfig.labels, buttonText: 'Choose Files' }
                        }}
                        onFilesSelected={handleFilesSelected}
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Modern Button</h4>
                      <FileUpload
                        config={{
                          variant: 'button',
                          size: 'md',
                          theme: 'modern',
                          labels: { ...defaultConfig.labels, buttonText: 'Upload Files' }
                        }}
                        onFilesSelected={handleFilesSelected}
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Minimal Button</h4>
                      <FileUpload
                        config={{
                          variant: 'button',
                          size: 'md',
                          theme: 'minimal',
                          labels: { ...defaultConfig.labels, buttonText: 'Select Files' }
                        }}
                        onFilesSelected={handleFilesSelected}
                      />
                    </div>
                  </div>
                </div>

                {/* Dropzone Variants */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-lime-400 mb-6">Dropzone Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Modern Dropzone</h4>
                      <FileUpload
                        config={{
                          variant: 'dropzone',
                          size: 'lg',
                          theme: 'modern',
                          showPreview: true,
                          acceptedTypes: ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx', '.txt'],
                          labels: {
                            ...defaultConfig.labels,
                            title: 'Modern Dropzone',
                            subtitle: 'Drop files here or click to browse'
                          }
                        }}
                        onFilesSelected={handleFilesSelected}
                        onFileUpload={mockUpload}
                        storageKey="modernDropzone"
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Classic Dropzone</h4>
                      <FileUpload
                        config={{
                          variant: 'dropzone',
                          size: 'lg',
                          theme: 'classic',
                          showPreview: true,
                          acceptedTypes: ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx', '.txt'],
                          labels: {
                            ...defaultConfig.labels,
                            title: 'Classic Dropzone',
                            subtitle: 'Drag and drop files here'
                          }
                        }}
                        onFilesSelected={handleFilesSelected}
                        onFileUpload={mockUpload}
                        storageKey="classicDropzone"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Variants */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-lime-400 mb-6">Preview Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Image Preview</h4>
                      <FileUpload
                        config={{
                          variant: 'preview',
                          size: 'md',
                          theme: 'modern',
                          acceptedTypes: ['image/*'],
                          showPreview: true,
                          labels: {
                            ...defaultConfig.labels,
                            title: 'Upload Images',
                            subtitle: 'Images will show previews'
                          }
                        }}
                        onFilesSelected={handleFilesSelected}
                        onFileUpload={mockUpload}
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Document Preview</h4>
                      <FileUpload
                        config={{
                          variant: 'preview',
                          size: 'md',
                          theme: 'classic',
                          acceptedTypes: ['.pdf', '.doc', '.docx', '.txt'],
                          showPreview: false,
                          labels: {
                            ...defaultConfig.labels,
                            title: 'Upload Documents',
                            subtitle: 'PDF, Word, and text files'
                          }
                        }}
                        onFilesSelected={handleFilesSelected}
                        onFileUpload={mockUpload}
                      />
                    </div>
                  </div>
                </div>

                {/* Compact Variants */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-lime-400 mb-6">Compact Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Small Compact</h4>
                      <FileUpload
                        config={{
                          variant: 'compact',
                          size: 'sm',
                          theme: 'minimal',
                          labels: { ...defaultConfig.labels, buttonText: 'Select' }
                        }}
                        onFilesSelected={handleFilesSelected}
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Medium Compact</h4>
                      <FileUpload
                        config={{
                          variant: 'compact',
                          size: 'md',
                          theme: 'default',
                          labels: { ...defaultConfig.labels, buttonText: 'Choose' }
                        }}
                        onFilesSelected={handleFilesSelected}
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Large Compact</h4>
                      <FileUpload
                        config={{
                          variant: 'compact',
                          size: 'lg',
                          theme: 'modern',
                          labels: { ...defaultConfig.labels, buttonText: 'Upload' }
                        }}
                        onFilesSelected={handleFilesSelected}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Live Config Editor</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* JSON Editor */}
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-lime-400 mb-4">JSON Configuration</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Edit the JSON below to see real-time changes in the component. This configuration is LLM-friendly with a simple, declarative structure.
                    </p>
                    <textarea
                      value={configJSON}
                      onChange={(e) => handleJSONChange(e.target.value)}
                      className="w-full h-96 p-4 font-mono text-sm bg-black/50 border border-white/10 rounded-lg text-white resize-none focus:outline-none focus:border-lime-500"
                      placeholder="Paste your JSON configuration here..."
                    />
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleConfigChange(defaultConfig)}
                        className="px-4 py-2 bg-lime-500 text-black rounded-lg hover:bg-lime-400 transition-colors"
                      >
                        Reset to Default
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(configJSON)}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Copy Config
                      </button>
                    </div>
                  </div>

                  {/* Preset Configurations */}
                  <div className="space-y-6">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                      <h3 className="text-xl font-semibold text-lime-400 mb-4">Preset Configurations</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <button
                          onClick={() => applyPreset('imageOnly')}
                          className="p-4 text-left border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                        >
                          <div className="font-medium text-white">Image Only</div>
                          <div className="text-sm text-gray-400">Preview variant for images with auto-upload</div>
                        </button>
                        <button
                          onClick={() => applyPreset('documentOnly')}
                          className="p-4 text-left border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                        >
                          <div className="font-medium text-white">Document Only</div>
                          <div className="text-sm text-gray-400">Button variant for PDF, Word, and text files</div>
                        </button>
                        <button
                          onClick={() => applyPreset('compact')}
                          className="p-4 text-left border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                        >
                          <div className="font-medium text-white">Compact</div>
                          <div className="text-sm text-gray-400">Small, minimal design for space constraints</div>
                        </button>
                        <button
                          onClick={() => applyPreset('modern')}
                          className="p-4 text-left border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                        >
                          <div className="font-medium text-white">Modern</div>
                          <div className="text-sm text-gray-400">Gradient theme with modern styling</div>
                        </button>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                      <h3 className="text-xl font-semibold text-lime-400 mb-4">Live Preview</h3>
                      <div className="space-y-4">
                        <div className="text-sm text-gray-300">
                          <div>Variant: <span className="text-white">{currentConfig.variant}</span></div>
                          <div>Size: <span className="text-white">{currentConfig.size}</span></div>
                          <div>Theme: <span className="text-white">{currentConfig.theme}</span></div>
                        </div>
                        <FileUpload
                          config={currentConfig}
                          onFilesSelected={handleFilesSelected}
                          onFileUpload={mockUpload}
                          storageKey="configPreview"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App 