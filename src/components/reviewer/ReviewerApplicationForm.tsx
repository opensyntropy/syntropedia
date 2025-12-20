'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from '@/lib/IntlProvider'

interface ReviewerApplicationFormProps {
  locale: string
}

interface FormData {
  motivation: string
  fullAddress: string
  city: string
  state: string
  country: string
  education: string
  yearsExperience: string
  experienceDetails: string
  socialLinkedin: string
  socialInstagram: string
  socialTwitter: string
  socialWebsite: string
}

export function ReviewerApplicationForm({ locale }: ReviewerApplicationFormProps) {
  const router = useRouter()
  const t = useTranslations('becomeReviewer')
  const [formData, setFormData] = useState<FormData>({
    motivation: '',
    fullAddress: '',
    city: '',
    state: '',
    country: '',
    education: '',
    yearsExperience: '',
    experienceDetails: '',
    socialLinkedin: '',
    socialInstagram: '',
    socialTwitter: '',
    socialWebsite: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/reviewer-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          yearsExperience: parseInt(formData.yearsExperience) || 0,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit application')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('applyTitle')}</CardTitle>
        <CardDescription>{t('applyDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Motivation */}
          <div className="space-y-2">
            <Label htmlFor="motivation">
              {t('motivationLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) => handleChange('motivation', e.target.value)}
              placeholder={t('motivationPlaceholder')}
              rows={4}
              required
              minLength={50}
            />
            <p className="text-xs text-muted-foreground">{t('motivationHint')}</p>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">{t('addressSection')}</h3>

            <div className="space-y-2">
              <Label htmlFor="fullAddress">
                {t('fullAddress')} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="fullAddress"
                value={formData.fullAddress}
                onChange={(e) => handleChange('fullAddress', e.target.value)}
                placeholder={t('fullAddressPlaceholder')}
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  {t('city')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">
                  {t('state')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">
                {t('country')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Education & Experience Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">{t('experienceSection')}</h3>

            <div className="space-y-2">
              <Label htmlFor="education">
                {t('education')} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => handleChange('education', e.target.value)}
                placeholder={t('educationPlaceholder')}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsExperience">
                {t('yearsExperience')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="yearsExperience"
                type="number"
                min="0"
                max="100"
                value={formData.yearsExperience}
                onChange={(e) => handleChange('yearsExperience', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceDetails">
                {t('experienceDetails')} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="experienceDetails"
                value={formData.experienceDetails}
                onChange={(e) => handleChange('experienceDetails', e.target.value)}
                placeholder={t('experienceDetailsPlaceholder')}
                rows={4}
                required
                minLength={50}
              />
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">{t('socialSection')}</h3>
            <p className="text-xs text-muted-foreground">{t('socialHint')}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="socialLinkedin">LinkedIn</Label>
                <Input
                  id="socialLinkedin"
                  type="url"
                  value={formData.socialLinkedin}
                  onChange={(e) => handleChange('socialLinkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialInstagram">Instagram</Label>
                <Input
                  id="socialInstagram"
                  value={formData.socialInstagram}
                  onChange={(e) => handleChange('socialInstagram', e.target.value)}
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="socialTwitter">Twitter/X</Label>
                <Input
                  id="socialTwitter"
                  value={formData.socialTwitter}
                  onChange={(e) => handleChange('socialTwitter', e.target.value)}
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialWebsite">{t('website')}</Label>
                <Input
                  id="socialWebsite"
                  type="url"
                  value={formData.socialWebsite}
                  onChange={(e) => handleChange('socialWebsite', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('submitApplication')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
