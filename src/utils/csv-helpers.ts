import { csv2json, json2csv } from "json-2-csv"

//shamelessly stolen from medusa: https://github.com/medusajs/medusa/blob/develop/packages/core/core-flows/src/product/utils/csvtojson.ts
export const convertCsvToJson = <T extends object>(
  data: string
): T[] => {
  return csv2json(data, {
    preventCsvInjection: true,
    delimiter: { field: detectDelimiter(data) },
    trimHeaderFields: true,
    trimFieldValues: true
  }) as T[]
}

const delimiters = [",", ";", "|"]

const detectDelimiter = (data: string) => {
  let delimiter = ","
  const header = data.split("\n")[0]

  for (const del of delimiters) {
    if (header.split(del).length > 1) {
      delimiter = del
      break
    }
  }

  return delimiter
}

export const convertJsonToCsv = (
  data: object[]
): string => {
  return json2csv(
    data, {
      delimiter: {
        field: ';'
      }
    }
  )
}