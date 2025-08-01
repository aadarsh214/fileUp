import { FileUpload } from './file-upload'
import type { FileUploadProps } from './file-upload'

export interface FileUploadDropzoneProps extends Omit<FileUploadProps, 'config'> {
  config?: Partial<FileUploadProps['config']>
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = (props) => {
  return (
    <FileUpload
      {...props}
      config={{
        variant: 'dropzone',
        ...props.config
      }}
    />
  )
} 