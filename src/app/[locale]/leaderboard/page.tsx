import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LeaderboardTable } from '@/components/gamification/LeaderboardTable'
import { getLeaderboard } from '@/lib/services/gamification'
import { getTranslations } from '@/lib/getTranslations'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LeaderboardPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

type LeaderboardTab = 'xp' | 'contributors' | 'reviewers'
type LeaderboardPeriod = 'all_time' | 'month'

export default async function LeaderboardPage({ params, searchParams }: LeaderboardPageProps) {
  const { locale } = await params
  const sp = await searchParams
  const activeTab = (sp.tab as LeaderboardTab) || 'xp'
  const activePeriod = (sp.period as LeaderboardPeriod) || 'all_time'

  const t = await getTranslations(locale)
  const entries = await getLeaderboard(activeTab, activePeriod, 25)

  const tabs: { id: LeaderboardTab; labelKey: string; icon: string }[] = [
    { id: 'xp', labelKey: 'xpLeaders', icon: '⭐' },
    { id: 'contributors', labelKey: 'topContributors', icon: '🌱' },
    { id: 'reviewers', labelKey: 'topReviewers', icon: '🔍' },
  ]

  const periods: { id: LeaderboardPeriod; labelKey: string }[] = [
    { id: 'all_time', labelKey: 'allTime' },
    { id: 'month', labelKey: 'thisMonth' },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-3xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('collaboration.title')}</h1>
            <p className="mt-2 text-muted-foreground">
              {t('collaboration.subtitle')}
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="flex border-b">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/leaderboard?tab=${tab.id}&period=${activePeriod}`}
                  className={cn(
                    'flex-1 py-3 px-4 text-center text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'border-b-2 border-green-500 text-green-600 bg-green-50/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {t(`collaboration.${tab.labelKey}`)}
                </Link>
              ))}
            </div>

            {/* Period Toggle */}
            <div className="flex justify-center gap-2 py-3 bg-gray-50">
              {periods.map((period) => (
                <Link
                  key={period.id}
                  href={`/leaderboard?tab=${activeTab}&period=${period.id}`}
                  className={cn(
                    'px-4 py-1.5 text-sm rounded-full transition-colors',
                    activePeriod === period.id
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border'
                  )}
                >
                  {t(`collaboration.${period.labelKey}`)}
                </Link>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <LeaderboardTable entries={entries} />
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              {t('collaboration.earnXpHint')}
            </p>
            <Link
              href="/contributions/new"
              className="inline-block mt-2 text-green-600 hover:text-green-700 font-medium"
            >
              {t('collaboration.startContributing')}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
