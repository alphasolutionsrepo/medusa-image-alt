import { defineWidgetConfig } from '@medusajs/admin-sdk'
import { AdminProduct, DetailWidgetProps } from '@medusajs/framework/types'
import { Button, Container, Heading, Input, Table } from '@medusajs/ui'
import { sdk } from '../lib/sdk'

const imageAltPrefix = 'img-alt-'

const saveAlt = async (id: string, url: string) => {
  const input = document.getElementById(imageAltPrefix + id) as HTMLInputElement
  const alt = input?.value ?? ''
  const data = [{
    url: url,
    metadata: {
      alt: alt
    }
  }]
  await sdk.client.fetch(`/admin/image-metadata`, {
    method: 'POST',
    body: data
  })
}

const ImageAltsList = ({ data }: DetailWidgetProps<AdminProduct>) => {
  return <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2" className="text-center">
          Image alts
        </Heading>
      </div>
      <div className="flex flex-col justify-between gap-4">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Alt</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.images?.length ?? 0 > 0 ? (
              data.images!.map((img) => (
                <Table.Row key={img.id}>
                  <Table.Cell><a href={img.url} target='_blank'><img src={img.url} height={60} width={60} /></a></Table.Cell>
                  <Table.Cell>{img.url.substring(img.url.lastIndexOf('/')+1)}</Table.Cell>
                  <Table.Cell><Input id={imageAltPrefix + img.id} type='text' defaultValue={img?.metadata?.alt as string ?? '' } /></Table.Cell>
                  <Table.Cell><Button onClick={() => saveAlt(img.id, img.url)}>Save</Button></Table.Cell>
                </Table.Row>
              ))
            ) : (
              <div />
            )}
          </Table.Body>
        </Table>
        <div className="grid grid-cols-12 gap-4">

        </div>
      </div>
    </Container>
}

export const config = defineWidgetConfig({
  zone: 'product.details.after'
})

export default ImageAltsList
