import { FileUpload } from './file-upload'
import type { FileUploadProps } from './file-upload'

export interface FileUploadPreviewProps extends Omit<FileUploadProps, 'config'> {
  config?: Partial<FileUploadProps['config']>
}

export const FileUploadPreview: React.FC<FileUploadPreviewProps> = (props) => {
  return (
    <FileUpload
      {...props}
      config={{
        variant: 'preview',
        showPreview: true,
        ...props.config
      }}
    />
  )
} 