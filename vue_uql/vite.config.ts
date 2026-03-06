import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import http from 'http'
import https from 'https'
import { URL } from 'url'

// ------- Inline API Server as Vite Plugin -------

interface OGData {
  title: string
  description: string
  image: string
  siteName: string
  url: string
  favicon: string
}

interface StoreEntry {
  originalUrl: string
  ogData: OGData
  createdAt: number
}

const urlStore = new Map<string, StoreEntry>()
let counter = 1000

function generateShortCode(): string {
  counter++
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let code = ''
  let n = counter
  while (n > 0) {
    code = chars[n % chars.length] + code
    n = Math.floor(n / chars.length)
  }
  while (code.length < 4) {
    code = chars[Math.floor(Math.random() * chars.length)] + code
  }
  return code
}

function fetchPage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout')), 8000)
    const protocol = url.startsWith('https') ? https : http

    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UQLBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timeout)
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).toString()
        fetchPage(redirectUrl).then(resolve).catch(reject)
        return
      }

      let data = ''
      res.on('data', (chunk: Buffer) => { data += chunk.toString() })
      res.on('end', () => { clearTimeout(timeout); resolve(data) })
      res.on('error', (err: Error) => { clearTimeout(timeout); reject(err) })
    })

    req.on('error', (err: Error) => { clearTimeout(timeout); reject(err) })
  })
}

function extractOGData(html: string, url: string): OGData {
  const getMeta = (property: string): string => {
    const patterns = [
      new RegExp(`<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
      new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:${property}["']`, 'i'),
      new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
      new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, 'i'),
    ]
    for (const re of patterns) {
      const match = html.match(re)
      if (match) return match[1]
    }
    return ''
  }

  const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  const title = getMeta('title') || (titleTag ? titleTag[1].trim() : '')
  const description = getMeta('description') || ''
  const image = getMeta('image') || ''
  const siteName = getMeta('site_name') || ''

  let favicon = ''
  const favMatches = [
    html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i),
    html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["']/i)
  ]
  for (const m of favMatches) {
    if (m) { favicon = m[1]; break }
  }

  const parsedUrl = new URL(url)
  const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`

  const resolve = (u: string): string => {
    if (!u) return ''
    if (u.startsWith('http')) return u
    if (u.startsWith('//')) return parsedUrl.protocol + u
    if (u.startsWith('/')) return baseUrl + u
    return baseUrl + '/' + u
  }

  const decode = (t: string) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")

  return {
    title: decode(title),
    description: decode(description),
    image: resolve(image),
    siteName: decode(siteName),
    url,
    favicon: resolve(favicon) || `${baseUrl}/favicon.ico`
  }
}

function apiPlugin(): Plugin {
  return {
    name: 'uql-api',
    configureServer(server) {
      server.middlewares.use('/api/quantize', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
          res.writeHead(204)
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', async () => {
          try {
            const { url: inputUrl } = JSON.parse(body)

            if (!inputUrl) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'URL is required' }))
              return
            }

            let validUrl: string
            try {
              const parsed = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`)
              validUrl = parsed.toString()
            } catch {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Invalid URL format' }))
              return
            }

            let ogData: OGData
            try {
              const html = await fetchPage(validUrl)
              ogData = extractOGData(html, validUrl)
            } catch {
              ogData = {
                title: validUrl,
                description: '',
                image: '',
                siteName: new URL(validUrl).hostname,
                url: validUrl,
                favicon: `${new URL(validUrl).origin}/favicon.ico`
              }
            }

            const shortCode = generateShortCode()
            const shortUrl = `uql.sh/${shortCode}`
            urlStore.set(shortCode, { originalUrl: validUrl, ogData, createdAt: Date.now() })

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ shortCode, shortUrl, originalUrl: validUrl, ogData }))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal server error' }))
          }
        })
      })

      server.middlewares.use('/api/history', (req, res) => {
        if (req.method !== 'GET') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const entries = Array.from(urlStore.entries())
          .sort((a, b) => b[1].createdAt - a[1].createdAt)
          .slice(0, 5)
          .map(([code, data]) => ({
            shortCode: code,
            shortUrl: `uql.sh/${code}`,
            originalUrl: data.originalUrl,
            ogData: data.ogData,
            createdAt: data.createdAt
          }))

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(entries))
      })
    }
  }
}

// ------- Vite Config -------

export default defineConfig({
  plugins: [apiPlugin(), vue()],
  server: {
    port: 8080
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
