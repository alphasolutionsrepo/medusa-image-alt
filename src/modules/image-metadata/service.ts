import { InjectManager, MedusaContext, MedusaService } from "@medusajs/framework/utils"
import { Context, DAL } from "@medusajs/framework/types"
import { EntityManager } from "@mikro-orm/knex"
import { UrlAndMetadata } from "./types"

class ImageMetadataService extends MedusaService({
}) {
  @InjectManager()
  async setImageMetadataByUrl(
    data: UrlAndMetadata,
    @MedusaContext() sharedContext?: Context<EntityManager>
  ) : Promise<boolean> {

    let sql = `
    UPDATE public.image
    SET metadata = COALESCE(metadata,'{}')::jsonb`

    for (const entry of Object.entries(data.metadata)) {
      sql += `
        || jsonb_build_object('${entry[0]}', '${entry[1].replace("'", "''")}')`
    }
    
    sql += `
    where url = '${data.url}'`
    
    const response = await sharedContext?.manager?.execute(sql!)  

    return true
  }

  @InjectManager()
  async getImageUrlsWithMetadata(
    metadataFields: string[],
    onlyMissing: boolean,
    @MedusaContext() sharedContext?: Context<EntityManager>
  ) : Promise<UrlAndMetadata[]> {

    let sql = `
      SELECT distinct url, metadata
      FROM public.image
      WHERE deleted_at is null`

    if (onlyMissing) {
      sql += `
      AND (${metadataFields.map(f => `metadata['${f}'] is null`).join(' OR ')})`
    }
      
    const data = await sharedContext?.manager?.execute<UrlAndMetadata[]>(sql)  

    return data ?? []
  }

  
}

export default ImageMetadataService
