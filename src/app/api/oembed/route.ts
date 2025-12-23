import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const SITE_NAME = 'Syntropedia'

/**
 * oEmbed endpoint for rich embeds in Discourse and other platforms
 * Spec: https://oembed.com/
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const format = searchParams.get('format') || 'json'
  const maxwidth = parseInt(searchParams.get('maxwidth') || '600', 10)
  const maxheight = parseInt(searchParams.get('maxheight') || '400', 10)

  if (!url) {
    return NextResponse.json({ error: 'url parameter is required' }, { status: 400 })
  }

  if (format !== 'json') {
    return NextResponse.json({ error: 'Only JSON format is supported' }, { status: 501 })
  }

  // Parse species slug from URL
  // Expected format: https://syntropedia.org/species/slug or /species/slug
  const speciesMatch = url.match(/\/species\/([^/?#]+)/)
  if (!speciesMatch) {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 404 })
  }

  const slug = speciesMatch[1]

  // Fetch species from database
  const species = await prisma.species.findUnique({
    where: { slug },
    include: {
      photos: {
        where: { primary: true },
        take: 1,
      },
    },
  })

  if (!species) {
    return NextResponse.json({ error: 'Species not found' }, { status: 404 })
  }

  // Calculate embed dimensions (maintain aspect ratio)
  const width = Math.min(maxwidth, 600)
  const height = Math.min(maxheight, 320)

  // Get primary photo or placeholder
  const photoUrl = species.photos[0]?.url || `${SITE_URL}/images/species-placeholder.png`

  // Build the oEmbed response
  const oembedResponse = {
    type: 'rich',
    version: '1.0',
    title: species.scientificName,
    author_name: species.commonNames[0] || species.scientificName,
    provider_name: SITE_NAME,
    provider_url: SITE_URL,
    thumbnail_url: photoUrl,
    thumbnail_width: 300,
    thumbnail_height: 200,
    width,
    height,
    html: `<iframe src="${SITE_URL}/embed/species/${slug}" width="${width}" height="${height}" frameborder="0" style="border-radius: 12px; overflow: hidden;" allowtransparency="true"></iframe>`,
  }

  return NextResponse.json(oembedResponse, {
    headers: {
      'Content-Type': 'application/json+oembed',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
