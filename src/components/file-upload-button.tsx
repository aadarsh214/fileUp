import { FileUpload } from './file-upload'
import type { FileUploadProps } from './file-upload'

export interface FileUploadButtonProps extends Omit<FileUploadProps, 'config'> {
  config?: Partial<FileUploadProps['config']>
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = (props) => {
  return (
    <FileUpload
      {...props}
      config={{
        variant: 'button',
        ...props.config
      }}
    />
  )
} 