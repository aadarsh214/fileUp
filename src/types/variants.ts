export type FileUploadVariant = 'button' | 'dropzone' | 'preview' | 'compact'
export type FileUploadSize = 'sm' | 'md' | 'lg'
export type FileUploadTheme = 'default' | 'minimal' | 'modern' | 'classic'

export interface VariantProps {
  variant?: FileUploadVariant
  size?: FileUploadSize
  theme?: FileUploadTheme
}

export const variantStyles = {
  button: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  },
  dropzone: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  },
  preview: {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  },
  compact: {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  }
} as const

export const themeStyles = {
  default: {
    button: 'bg-lime-500 text-black font-semibold rounded-xl shadow-lg hover:bg-lime-400 hover:shadow-xl transition-all duration-200 hover:scale-105',
    dropzone: 'border-2 border-dashed border-lime-300 hover:border-lime-400 bg-lime-50/10',
    preview: 'border border-lime-200 bg-card',
    compact: 'border border-lime-200 bg-card'
  },
  minimal: {
    button: 'bg-transparent border-2 border-lime-400 text-lime-400 font-medium rounded-xl hover:bg-lime-400 hover:text-black transition-all duration-200 shadow-md hover:shadow-lg',
    dropzone: 'border-2 border-lime-200 bg-lime-50/5 hover:bg-lime-50/10',
    preview: 'bg-transparent border-0',
    compact: 'bg-transparent border-0'
  },
  modern: {
    button: 'bg-gradient-to-r from-lime-400 to-lime-600 text-black font-bold rounded-2xl shadow-xl hover:from-lime-300 hover:to-lime-500 hover:shadow-2xl transition-all duration-300 hover:scale-105',
    dropzone: 'border-2 border-dashed border-lime-300 bg-lime-50/10 hover:border-lime-400 hover:bg-lime-50/20',
    preview: 'border border-lime-200 bg-white shadow-lg',
    compact: 'border border-lime-200 bg-white shadow-md'
  },
  classic: {
    button: 'bg-lime-600 text-white font-semibold rounded-lg shadow-lg hover:bg-lime-700 hover:shadow-xl transition-all duration-200',
    dropzone: 'border-2 border-dashed border-lime-300 bg-lime-50/10 hover:border-lime-400',
    preview: 'border border-lime-200 bg-white shadow-md',
    compact: 'border border-lime-200 bg-white shadow-sm'
  }
} as const 