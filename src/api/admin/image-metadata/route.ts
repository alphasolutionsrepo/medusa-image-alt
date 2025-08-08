import { IMAGE_METADATA_MODULE } from '../../../modules/image-metadata'
import ImageMetadataService from '../../../modules/image-metadata/service'
import { UrlAndMetadata } from '../../../modules/image-metadata/types'
import { convertJsonToCsv } from '../../../utils/csv-helpers'
import { MedusaRequest, MedusaResponse } from '@medusajs/framework'


export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<ImageMetadataService>(IMAGE_METADATA_MODULE)

  const data = req.body as UrlAndMetadata[];

  for (const image of data) {
    await service.setImageMetadataByUrl(image)
  }
  
  res.json({ 'status': 'ok' })
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service = req.scope.resolve<ImageMetadataService>(IMAGE_METADATA_MODULE)

  const metadataFields = req.query['field'] ? (Array.isArray(req.query['field']) ? req.query['field'] as string[] : [ req.query['field'] as string ]) : ['alt']
  const onlyMissing = req.query['onlyMissing'] == '1'

  const result = await service.getImageUrlsWithMetadata(
    metadataFields,
    onlyMissing
  )

  const mapped : Record<string, Record<string, string>> = {}

  result.forEach(line => {
    mapped[line.url] = mapped[line.url] ?? { url: line.url }

    for (const field of metadataFields) {
      mapped[line.url][field] = line?.metadata?.[field]?.toString() ?? ''
    }
  })

  const csv = convertJsonToCsv(Object.values(mapped))

  res.attachment('missing-metadata.csv')
  res.contentType('text/csv')
  res.send(csv)
}
