# @file-upload/ui



# @aadarshg214/file-upload-ui

A config-driven, accessible file upload component library built with React, TypeScript, and Tailwind CSS. Features multiple variants, themes, and real-time configuration editing.

## ✨ Features

[Keep existing features section...]

## 🚀 Quick Start

### Installation

```bash
npm install @aadarshg214/file-upload-ui
```

### Basic Usage

```tsx
import { FileUpload } from '@aadarshg214/file-upload-ui'

function App() {
  const handleFilesSelected = (files: File[]) => {
    console.log('Files selected:', files)
  }

  return (
    <FileUpload
      onFilesSelected={handleFilesSelected}
      config={{
        variant: 'dropzone',
        theme: 'modern',
        maxSize: 10 * 1024 * 1024, // 10MB
        acceptedTypes: ['image/*', '.pdf']
      }}
    />
  )
}
```

## 📋 Component Variants

[Keep existing variants section...]

## 🎨 Configuration System

[Keep existing configuration section...]

## 📦 Installation & Setup

1. Install the package:
```bash
npm install @aadarshg214/file-upload-ui
```

2. Add Tailwind CSS configuration:
```js
// tailwind.config.js
module.exports = {
  content: [
    // ...
    "./node_modules/@aadarshg214/file-upload-ui/**/*.{js,ts,jsx,tsx}",
  ],
}
```

3. Import styles in your app:
```tsx
import '@aadarshg214/file-upload-ui/styles'
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build the library
npm run build:lib

# Create package
npm run pack
```

## 🛠️ Tech Stack

- React 19
- TypeScript 5.8
- Tailwind CSS 4.1
- Vite 7.0
- Radix UI

## 📝 License

MIT © 

## 📦 Package Information

- Package: [@aadarshg214/file-upload-ui](https://www.npmjs.com/package/@aadarshg214/file-upload-ui)
- Version: 1.0.0
- License: MIT
- Author: Aadarsh Gupta
- Repository: https://github.com/aadarsh214/fileUp

A config-driven, accessible file upload component library built with React, TypeScript, and Tailwind CSS. Features multiple variants, themes, and real-time configuration editing.

## ✨ Features

- 🎨 **Config-Driven**: Fully customizable via JSON configuration
- ♿ **Accessible**: Keyboard navigation, screen reader support, ARIA labels
- 📦 **NPM Ready**: Proper package structure with TypeScript support
- 🎯 **Multiple Variants**: Button, dropzone, preview, and compact layouts
- 🌈 **Theme Support**: Default, minimal, modern, and classic themes
- 📱 **Responsive**: Works perfectly on all devices
- 🔧 **TypeScript**: Full type safety throughout
- ⚡ **Fast**: Built with Vite for lightning-fast development
- 💾 **LocalStorage**: Files persist across page refreshes
- 🖼️ **Image Previews**: Beautiful image previews with status overlays

## 🚀 Quick Start

### Installation

```bash
npm install @file-upload/ui
```

### Basic Usage

```tsx
import { FileUpload } from '@file-upload/ui'

function App() {
  const handleFilesSelected = (files: File[]) => {
    console.log('Files selected:', files)
  }

  return (
    <FileUpload
      onFilesSelected={handleFilesSelected}
      config={{
        variant: 'dropzone',
        theme: 'modern',
        maxSize: 10 * 1024 * 1024, // 10MB
        acceptedTypes: ['image/*', '.pdf']
      }}
    />
  )
}
```

## 📋 Component Variants

### 1. Button Variant
Simple button-style upload with icon placement options.

```tsx
<FileUpload
  config={{
    variant: 'button',
    size: 'md',
    theme: 'default',
    iconPlacement: 'left'
  }}
/>
```

### 2. Dropzone Variant
Drag-and-drop interface with visual feedback.

```tsx
<FileUpload
  config={{
    variant: 'dropzone',
    size: 'lg',
    theme: 'modern',
    borderStyle: 'dashed'
  }}
/>
```

### 3. Preview Variant
Upload with file previews and progress tracking.

```tsx
<FileUpload
  config={{
    variant: 'preview',
    showPreview: true,
    showProgress: true,
    acceptedTypes: ['image/*']
  }}
  onFileUpload={async (file) => {
    // Handle file upload
    await uploadToServer(file)
  }}
/>
```

### 4. Compact Variant
Minimal design for space-constrained layouts.

```tsx
<FileUpload
  config={{
    variant: 'compact',
    size: 'sm',
    theme: 'minimal'
  }}
/>
```

## 🎨 Configuration System

The component is fully configurable via a JSON schema that's LLM-friendly with a simple, declarative structure:

```tsx
interface FileUploadConfig {
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
```

## 📝 JSON Configuration Examples

### Basic Dropzone
```json
{
  "variant": "dropzone",
  "size": "md",
  "theme": "default",
  "maxSize": 10485760,
  "acceptedTypes": ["image/*", ".pdf", ".doc"],
  "multiple": true,
  "labels": {
    "title": "Upload Files",
    "subtitle": "Drag and drop files here or click to browse",
    "buttonText": "Choose Files",
    "dragText": "Drag files here",
    "dropText": "Drop files here",
    "errorText": "Error uploading file",
    "successText": "File uploaded successfully"
  }
}
```

### Image-Only Preview
```json
{
  "variant": "preview",
  "size": "lg",
  "theme": "modern",
  "maxSize": 5242880,
  "acceptedTypes": ["image/*"],
  "multiple": true,
  "showPreview": true,
  "showProgress": true,
  "autoUpload": true,
  "labels": {
    "title": "Upload Images",
    "subtitle": "Drag and drop images here or click to browse",
    "buttonText": "Select Images",
    "dragText": "Drag images here",
    "dropText": "Drop images here",
    "errorText": "Error uploading image",
    "successText": "Image uploaded successfully"
  }
}
```

### Compact Button
```json
{
  "variant": "compact",
  "size": "sm",
  "theme": "minimal",
  "maxSize": 2097152,
  "acceptedTypes": [".pdf", ".doc", ".txt"],
  "multiple": false,
  "labels": {
    "title": "Quick Upload",
    "subtitle": "Select a document to upload",
    "buttonText": "Choose File",
    "dragText": "Drag file here",
    "dropText": "Drop file here",
    "errorText": "Error uploading file",
    "successText": "File uploaded successfully"
  }
}
```

## 🛠️ API Reference

### FileUpload Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `Partial<FileUploadConfig>` | `defaultConfig` | Configuration object |
| `onFilesSelected` | `(files: File[]) => void` | - | Callback when files are selected |
| `onFileUpload` | `(file: FileWithPreview) => Promise<void>` | - | Callback for file upload |
| `onFileRemove` | `(fileId: string) => void` | - | Callback when file is removed |
| `className` | `string` | - | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable the component |
| `storageKey` | `string` | `'fileUpload'` | localStorage key for persistence |

### Utility Functions

```tsx
import { 
  createFileUploadConfig,
  getConfigFromJSON,
  exportConfigToJSON,
  validateConfig,
  saveFilesToStorage,
  loadFilesFromStorage,
  clearFilesFromStorage
} from '@file-upload/ui'

// Create config with overrides
const config = createFileUploadConfig({
  variant: 'button',
  theme: 'modern'
})

// Parse JSON string to config
const config = getConfigFromJSON(jsonString)

// Export config to JSON
const jsonString = exportConfigToJSON(config)

// Validate config
const { isValid, errors } = validateConfig(config)

// Storage utilities
saveFilesToStorage(files, 'myUploadKey')
const files = loadFilesFromStorage('myUploadKey')
clearFilesFromStorage('myUploadKey')
```

### Preset Configurations

```tsx
import { configPresets } from '@file-upload/ui'

// Use preset configurations
<FileUpload config={configPresets.imageOnly} />
<FileUpload config={configPresets.documentOnly} />
<FileUpload config={configPresets.compact} />
<FileUpload config={configPresets.modern} />
```

## 🎯 Accessibility Features

- **Keyboard Navigation**: Full keyboard support with Enter/Space activation
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Clear focus indicators and logical tab order
- **Error Handling**: Accessible error messages and validation feedback
- **Drag & Drop**: Keyboard fallback for drag-and-drop functionality

## 🎨 Theming

The component supports four built-in themes:

### Default Theme
Clean, professional design with neutral colors.

### Minimal Theme
Subtle borders and transparent backgrounds.

### Modern Theme
Gradient buttons and blue accent colors.

### Classic Theme
Traditional gray color scheme.

## 🧪 Demo

Run the development server to see the interactive demo:

```bash
npm run dev
```

Visit `http://localhost:5173` to see:
- **Live Demo**: Interactive file upload with real-time configuration
- **All Variants**: Showcase of all component variants and themes
- **Config Editor**: Live JSON configuration editor with real-time preview
- **Preset Configurations**: Pre-built configurations for common use cases

### Demo Features

1. **Live Demo Tab**
   - Real-time component preview
   - Current configuration display
   - Upload summary with statistics

2. **All Variants Tab**
   - Button variants (Default, Modern, Minimal)
   - Dropzone variants (Modern, Classic)
   - Preview variants (Image, Document)
   - Compact variants (Small, Medium, Large)

3. **Config Editor Tab**
   - Live JSON editor with syntax highlighting
   - Real-time component preview
   - Preset configuration buttons
   - Copy/Reset functionality

## 📦 Building for Production

### Build the Library
```bash
npm run build:lib
```

### Create NPM Package
```bash
npm run pack
```

### Development
```bash
npm run dev
```

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── file-upload.tsx          # Main component
│   ├── file-upload-button.tsx   # Button variant
│   ├── file-upload-dropzone.tsx # Dropzone variant
│   └── file-upload-preview.tsx  # Preview variant
├── types/
│   ├── config.ts                # Configuration types
│   └── variants.ts              # Variant types
├── config/
│   └── default-config.ts        # Default configuration
├── utils/
│   ├── config.ts                # Configuration utilities
│   └── storage.ts               # Storage utilities
├── lib/
│   └── utils.ts                 # General utilities
└── demo/
    └── App.tsx                  # Demo application
```

### Adding New Variants

1. Add variant type to `types/variants.ts`
2. Add styles to `variantStyles` and `themeStyles`
3. Implement variant logic in `file-upload.tsx`
4. Create variant-specific component (optional)
5. Update documentation

## 🛠 Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Radix UI** - Accessible UI primitives
- **clsx & tailwind-merge** - Conditional styling utilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component design patterns
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling
- [Vite](https://vitejs.dev/) for the fast build tool
