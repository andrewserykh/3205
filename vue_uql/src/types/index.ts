export interface OGMeta {
  title: string | null
  description: string | null
  image: string | null
}

export interface QuantizeResponse {
  uql: string
  shortUrl: string
  meta: OGMeta
}

export interface HistoryItem {
  uql: string
  url: string
  meta: OGMeta
  created: Date
}