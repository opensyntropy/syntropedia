'use client'

import { useState } from 'react'
import { useTranslations } from '@/lib/IntlProvider'
import { ChevronDown, ChevronUp, MessageSquare, ExternalLink, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface DiscoursePost {
  id: number
  username: string
  name: string | null
  avatarUrl: string
  content: string
  createdAt: string
  postNumber: number
}

interface DiscourseDiscussionProps {
  topicUrl: string | null
  speciesName: string
}

export function DiscourseDiscussion({ topicUrl, speciesName }: DiscourseDiscussionProps) {
  const t = useTranslations('species.discussion')
  const [isOpen, setIsOpen] = useState(false)
  const [posts, setPosts] = useState<DiscoursePost[] | null>(null)
  const [postsCount, setPostsCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    if (!topicUrl || posts !== null) return // Already fetched or no topic

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/discourse/topic?url=${encodeURIComponent(topicUrl)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch discussion')
      }
      const data = await response.json()
      setPosts(data.posts)
      setPostsCount(data.postsCount)
    } catch (err) {
      console.error('Failed to fetch Discourse posts:', err)
      setError(t('errorLoading'))
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      fetchPosts()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // If no topic URL, show "discussion coming soon" message
  if (!topicUrl) {
    return (
      <Card className="bg-gray-50">
        <CardHeader className="py-4">
          <div className="flex items-center gap-2 text-gray-500">
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">{t('title')}</span>
            <span className="text-sm">- {t('comingSoon')}</span>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <span className="font-medium">{t('title')}</span>
                {postsCount > 0 && (
                  <span className="text-sm text-gray-500">
                    ({postsCount} {postsCount === 1 ? t('post') : t('posts')})
                  </span>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}

            {error && (
              <div className="text-center py-4 text-red-600">
                {error}
              </div>
            )}

            {posts && posts.length > 0 && (
              <div className="space-y-4">
                {/* Show first few posts as preview */}
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <img
                        src={post.avatarUrl}
                        alt={post.name || post.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{post.name || post.username}</span>
                          <span className="text-gray-400">@{post.username}</span>
                          <span className="text-gray-400">&middot;</span>
                          <span className="text-gray-500">{formatDate(post.createdAt)}</span>
                        </div>
                        <div
                          className="mt-1 text-sm text-gray-700 prose prose-sm max-w-none line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {posts.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    {t('andMorePosts', { count: posts.length - 3 })}
                  </p>
                )}
              </div>
            )}

            {posts && posts.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                {t('noPosts')}
              </p>
            )}

            {/* Join discussion button */}
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(topicUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('joinDiscussion')}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
