import { Container, Heading, Input, Text, Button, Checkbox, Divider } from '@medusajs/ui'
import { defineWidgetConfig } from '@medusajs/admin-sdk'
import { FileType, FileUpload } from '../components/file-upload'
import { convertCsvToJson } from '../../utils/csv-helpers'
import { useState } from 'react'
import { sdk } from '../lib/sdk'
import { AdminStore, DetailWidgetProps } from '@medusajs/framework/types'

const ImageMetadataImportExport = ({ data }: DetailWidgetProps<AdminStore>) => {

  const [fields, setFields] = useState<string>('alt')
  const [generating, setGenerating] = useState<boolean>(false)
  const [onlyMissing, setOnlyMissing] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const handleDownload = async () => {
    setGenerating(true)
    window.location.href = '/admin/image-metadata?' + fields.split(',').map(f => `field=${f}`).join('&')
  }

  const handleUpload = async (file: FileType[]) => {
    setUploading(true)
    const csv = await file[0].file.text()
    const json = convertCsvToJson<Record<string, string>>(csv)
    const count = json.length
    const batchSize = 100
    let batch : Record<string, string>[] = []
    do {
      batch = json.splice(0, batchSize)
      if (batch.length == 0) break
      
      const remaining = json.length
      setMessage(
        `Handling images ${count - remaining - batch.length + 1} to ${
          count - remaining
        } of ${count} - keep the page open while the import runs.`
      )

      const data = batch.map(entry => {
        const url = entry.url
        delete entry.url
        return {
          url: url,
          metadata: entry
        }
      })

      await sdk.client.fetch(`/admin/image-metadata`, {
        method: 'POST',
        body: data
      })

    } while (batch.length > 0)

    setMessage(`Done setting metadata on ${count} images - the page can be closed.`)

    //setIsUploading(false)
  }

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Image Metadata</Heading>
        </div>
        <div className="items-center justify-between px-6 py-4">
          <Heading level="h3">Download as CSV</Heading>
          <div className="flex flex-col">
            {
              !generating && <>
                <Text className="my-4">Metadata properties to include (Comma seperated).</Text>
                <Input inputMode='text' value={fields} onChange={(e) => setFields(e.target.value)} />
                <Text className="my-4">Only include entries missing the property(ies)</Text>
                <Checkbox id='onlymissing' checked={onlyMissing} onCheckedChange={() => setOnlyMissing(!onlyMissing)}></Checkbox>
                <Button className="my-4" onClick={handleDownload}>Download</Button>
              </>
            }
            {
              generating && <>
                <Text>Generating output file, download will start automatically once finished...</Text>
              </>
            }
          </div>
        </div>
        <div className="items-center justify-between px-6 py-4">
          <Heading level="h3">Upload from CSV</Heading>
          <div className="flex h-full flex-col">
            {
              !uploading && <>
                <Text className="my-4">Upload csv file with metadata to set on image. "url" is a required column.</Text>
                <FileUpload
                      label={'Upload csv file'}
                      formats={['text/csv']}
                      onUploaded={(files) => handleUpload(files)}
                      multiple={false}
                    />
              </>
            }
            {
              uploading && <>
                <Text className="my-4">{message}</Text>
              </>
            }
          </div>
        </div>
        
      </Container>
    </>
  )
}


export const config = defineWidgetConfig({
  zone: 'store.details.after'
})

export default ImageMetadataImportExport

