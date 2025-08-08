import { model } from '@medusajs/framework/utils'

//This module just needs to be able to run custom sql on the db, but for some reason I couldn't make
//it get the injections necesary without a model being present and the service extending from MedusaService
// - however, the model does not need to be implemented. This is just a dummy model, with a table name that explains where it came from.
const ImageMetadata = model.define('imgMetadata', {
  id: model.id().primaryKey()
})

export default ImageMetadata
