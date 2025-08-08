import { Module } from '@medusajs/framework/utils'
import ImageMetadataService from './service'

export const IMAGE_METADATA_MODULE = 'imageMetadata'

export default Module(IMAGE_METADATA_MODULE, {
  service: ImageMetadataService
})
