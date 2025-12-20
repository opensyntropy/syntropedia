'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from '@/lib/IntlProvider'
import { Check, X, User, MapPin, GraduationCap, Briefcase, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

interface Application {
  id: string
  userId: string
  motivation: string
  fullAddress: string
  city: string
  state: string
  country: string
  education: string
  yearsExperience: number
  experienceDetails: string
  socialLinkedin: string | null
  socialInstagram: string | null
  socialTwitter: string | null
  socialWebsite: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewNote: string | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
    avatar: string | null
  }
  reviewedBy: {
    id: string
    name: string | null
  } | null
}

interface ApplicationsListProps {
  applications: Application[]
  locale: string
}

export function ApplicationsList({ applications, locale }: ApplicationsListProps) {
  const router = useRouter()
  const t = useTranslations('admin')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [noteId, setNoteId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id)
    try {
      const response = await fetch(`/api/reviewer-applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, note: note.trim() || undefined }),
      })

      if (!response.ok) {
        throw new Error('Failed to process application')
      }

      setNote('')
      setNoteId(null)
      router.refresh()
    } catch (error) {
      console.error('Error processing application:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const hasSocialLinks = (app: Application) => {
    return app.socialLinkedin || app.socialInstagram || app.socialTwitter || app.socialWebsite
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">{t('noApplications')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => {
        const isExpanded = expandedId === application.id

        return (
          <Card key={application.id}>
            <CardContent className="py-4">
              {/* Header Row */}
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {application.user.avatar ? (
                    <img
                      src={application.user.avatar}
                      alt={application.user.name || ''}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">
                      {application.user.name || application.user.email}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      application.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : application.status === 'APPROVED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {t(application.status.toLowerCase())}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{application.user.email}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{t('appliedOn')}: {new Date(application.createdAt).toLocaleDateString(locale)}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {application.city}, {application.state}, {application.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {application.yearsExperience} {t('yearsExp')}
                    </span>
                  </div>
                </div>

                {/* Expand/Collapse & Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(application.id)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    {isExpanded ? t('collapse') : t('expand')}
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  {/* Motivation */}
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">{t('motivation')}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {application.motivation}
                    </p>
                  </div>

                  {/* Location Details */}
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('location')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {application.fullAddress}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {application.city}, {application.state}, {application.country}
                    </p>
                  </div>

                  {/* Education & Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm font-medium mb-1 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        {t('education')}
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {application.education}
                      </p>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm font-medium mb-1 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {t('experience')} ({application.yearsExperience} {t('yearsExp')})
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {application.experienceDetails}
                      </p>
                    </div>
                  </div>

                  {/* Social Links */}
                  {hasSocialLinks(application) && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        {t('socialLinks')}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {application.socialLinkedin && (
                          <a
                            href={application.socialLinkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                        {application.socialInstagram && (
                          <span className="text-sm text-muted-foreground">
                            Instagram: {application.socialInstagram}
                          </span>
                        )}
                        {application.socialTwitter && (
                          <span className="text-sm text-muted-foreground">
                            Twitter: {application.socialTwitter}
                          </span>
                        )}
                        {application.socialWebsite && (
                          <a
                            href={application.socialWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {t('website')}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin Review Note (if already reviewed) */}
                  {application.status !== 'PENDING' && application.reviewNote && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                      <p className="text-sm font-medium mb-1">{t('adminNote')}:</p>
                      <p className="text-sm text-muted-foreground">{application.reviewNote}</p>
                    </div>
                  )}

                  {/* Actions for Pending Applications */}
                  {application.status === 'PENDING' && (
                    <div className="pt-2 border-t">
                      {/* Note input */}
                      <div className="mb-3">
                        <Textarea
                          value={noteId === application.id ? note : ''}
                          onChange={(e) => {
                            setNoteId(application.id)
                            setNote(e.target.value)
                          }}
                          placeholder={t('notePlaceholder')}
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleDecision(application.id, 'APPROVED')}
                          disabled={processingId === application.id}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t('approve')}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDecision(application.id, 'REJECTED')}
                          disabled={processingId === application.id}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {t('reject')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
