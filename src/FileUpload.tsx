import React from 'react'
import { GoogleLocationHistory } from './types'

interface FileUploadProps {
  onUpload: (data: GoogleLocationHistory) => void
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as GoogleLocationHistory
          onUpload(data)
        } catch (error) {
          console.error('Error parsing JSON:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="mb-4">
      <input
        type="file"
        onChange={handleFileChange}
        accept=".json"
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
    </div>
  )
}