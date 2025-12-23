/**
 * Discourse API integration for Syntropedia
 * Creates topics for species and fetches discussions
 */

const DISCOURSE_URL = process.env.DISCOURSE_URL || 'https://placenta.opensyntropy.earth'
const DISCOURSE_API_KEY = process.env.DISCOURSE_API_KEY
const DISCOURSE_API_USERNAME = process.env.DISCOURSE_API_USERNAME || 'system'
const DISCOURSE_SPECIES_CATEGORY_ID = parseInt(process.env.DISCOURSE_SPECIES_CATEGORY_ID || '53', 10)
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface SpeciesForTopic {
  id: string
  slug: string
  scientificName: string
  commonNames: string[]
  stratum?: string | null
  successionalStage?: string | null
  growthRate?: string | null
  heightMeters?: number | null
  uses?: string[]
}

interface CreateTopicResult {
  topicUrl: string
  topicId: number
}

interface DiscoursePost {
  id: number
  username: string
  name: string | null
  avatar_template: string
  cooked: string
  created_at: string
  post_number: number
}

interface DiscourseTopicResponse {
  id: number
  title: string
  posts_count: number
  post_stream: {
    posts: DiscoursePost[]
  }
}

/**
 * Format species data into markdown for Discourse topic body
 * The species URL on its own line triggers Discourse Onebox/oEmbed for rich preview
 */
function formatSpeciesTopicBody(species: SpeciesForTopic): string {
  const speciesUrl = `${SITE_URL}/species/${species.slug}`

  const lines: string[] = []

  // Species URL on its own line - Discourse will auto-embed via oEmbed
  lines.push(speciesUrl)
  lines.push('')

  // Brief intro for context
  if (species.commonNames.length > 0) {
    lines.push(`**${species.scientificName}** (${species.commonNames.join(', ')}) has been submitted to Syntropedia for community review.`)
  } else {
    lines.push(`**${species.scientificName}** has been submitted to Syntropedia for community review.`)
  }

  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push('### Discussion')
  lines.push('')
  lines.push('Share your experience with this species:')
  lines.push('- Have you cultivated it? What conditions worked best?')
  lines.push('- Do you have additional information about its uses?')
  lines.push('- Any corrections or improvements to suggest?')
  lines.push('')
  lines.push('*Your input helps build a comprehensive, community-verified encyclopedia.*')

  return lines.join('\n')
}

/**
 * Create a Discourse topic for a species submission
 * @returns Topic URL and ID, or null if creation failed
 */
export async function createSpeciesDiscourseTopic(
  species: SpeciesForTopic
): Promise<CreateTopicResult | null> {
  if (!DISCOURSE_API_KEY) {
    console.warn('[Discourse] API key not configured, skipping topic creation')
    return null
  }

  try {
    const title = species.commonNames.length > 0
      ? `${species.scientificName} - ${species.commonNames[0]}`
      : species.scientificName

    const body = formatSpeciesTopicBody(species)

    const response = await fetch(`${DISCOURSE_URL}/posts.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': DISCOURSE_API_KEY,
        'Api-Username': DISCOURSE_API_USERNAME,
      },
      body: JSON.stringify({
        title,
        raw: body,
        category: DISCOURSE_SPECIES_CATEGORY_ID,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Discourse] Failed to create topic:', response.status, errorText)
      return null
    }

    const data = await response.json()
    const topicId = data.topic_id
    const topicSlug = data.topic_slug

    const topicUrl = `${DISCOURSE_URL}/t/${topicSlug}/${topicId}`

    console.log('[Discourse] Created topic:', topicUrl)

    return {
      topicUrl,
      topicId,
    }
  } catch (error) {
    console.error('[Discourse] Error creating topic:', error)
    return null
  }
}

/**
 * Extract topic ID from a Discourse topic URL
 */
function extractTopicId(topicUrl: string): number | null {
  // Format: https://placenta.opensyntropy.earth/t/topic-slug/123
  const match = topicUrl.match(/\/t\/[^/]+\/(\d+)/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

/**
 * Fetch posts from a Discourse topic
 * @param topicUrl The full URL to the Discourse topic
 * @returns Array of posts or null if fetch failed
 */
export async function getDiscourseTopicPosts(topicUrl: string): Promise<{
  posts: Array<{
    id: number
    username: string
    name: string | null
    avatarUrl: string
    content: string
    createdAt: string
    postNumber: number
  }>
  postsCount: number
  topicUrl: string
} | null> {
  const topicId = extractTopicId(topicUrl)
  if (!topicId) {
    console.error('[Discourse] Invalid topic URL:', topicUrl)
    return null
  }

  try {
    // Fetch topic with posts (public endpoint, no auth needed)
    const response = await fetch(`${DISCOURSE_URL}/t/${topicId}.json`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      console.error('[Discourse] Failed to fetch topic:', response.status)
      return null
    }

    const data: DiscourseTopicResponse = await response.json()

    return {
      posts: data.post_stream.posts.map(post => ({
        id: post.id,
        username: post.username,
        name: post.name,
        avatarUrl: `${DISCOURSE_URL}${post.avatar_template.replace('{size}', '45')}`,
        content: post.cooked, // HTML content
        createdAt: post.created_at,
        postNumber: post.post_number,
      })),
      postsCount: data.posts_count,
      topicUrl,
    }
  } catch (error) {
    console.error('[Discourse] Error fetching topic posts:', error)
    return null
  }
}
