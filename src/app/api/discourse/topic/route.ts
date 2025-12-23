import { NextRequest, NextResponse } from 'next/server'
import { getDiscourseTopicPosts } from '@/lib/services/discourse'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const topicUrl = searchParams.get('url')

  if (!topicUrl) {
    return NextResponse.json({ error: 'Topic URL is required' }, { status: 400 })
  }

  const result = await getDiscourseTopicPosts(topicUrl)

  if (!result) {
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 })
  }

  return NextResponse.json(result)
}
