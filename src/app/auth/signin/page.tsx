'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const isDev = process.env.NODE_ENV === 'development'

// Seeded users for quick dev login
const devUsers = [
  { email: 'admin@syntropedia.org', name: 'Admin User', role: 'ADMIN' },
  { email: 'maria.silva@syntropedia.org', name: 'Maria Silva', role: 'USER' },
  { email: 'joao.santos@syntropedia.org', name: 'João Santos', role: 'USER' },
  { email: 'dr.botanica@syntropedia.org', name: 'Dr. Ana Botânica', role: 'REVIEWER' },
  { email: 'prof.agroforestry@syntropedia.org', name: 'Prof. Carlos Agroflorestas', role: 'REVIEWER' },
  { email: 'researcher.ecology@syntropedia.org', name: 'Dra. Fernanda Ecologia', role: 'REVIEWER' },
]

function SignInContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const error = searchParams.get('error')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const errorMessages: Record<string, string> = {
    OAuthSignin: 'Error starting the sign-in process. Please try again.',
    OAuthCallback: 'Error during authentication. Please try again.',
    OAuthCreateAccount: 'Could not create your account. Please try again.',
    EmailCreateAccount: 'Could not create your account. Please try again.',
    Callback: 'Authentication error. Please try again.',
    OAuthAccountNotLinked: 'This email is already associated with another account.',
    EmailSignin: 'Error sending the verification email. Please try again.',
    CredentialsSignin: 'User not found. Make sure you entered a valid seeded email.',
    SessionRequired: 'Please sign in to access this page.',
    Default: 'An error occurred. Please try again.',
  }

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    await signIn('dev-credentials', { email, callbackUrl })
    setIsLoading(false)
  }

  const handleQuickLogin = async (userEmail: string) => {
    setIsLoading(true)
    await signIn('dev-credentials', { email: userEmail, callbackUrl })
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-syntropy-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome to Syntropedia</CardTitle>
            <CardDescription className="mt-2">
              Sign in to contribute to the open knowledge encyclopedia on syntropic agriculture
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-center text-sm text-destructive">
              {errorMessages[error] || errorMessages.Default}
            </div>
          )}

          {/* Dev-only quick login section */}
          {isDev && (
            <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Development Mode
              </div>

              {/* Quick user buttons */}
              <div className="space-y-2">
                <p className="text-xs text-amber-700">Quick login as:</p>
                <div className="grid grid-cols-2 gap-2">
                  {devUsers.map((user) => (
                    <button
                      key={user.email}
                      onClick={() => handleQuickLogin(user.email)}
                      disabled={isLoading}
                      className="rounded-md border border-amber-300 bg-white px-2 py-1.5 text-left text-xs hover:bg-amber-100 disabled:opacity-50"
                    >
                      <div className="font-medium text-amber-900">{user.name}</div>
                      <div className="text-amber-600">{user.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom email input */}
              <form onSubmit={handleDevLogin} className="space-y-2">
                <p className="text-xs text-amber-700">Or enter any email:</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@syntropedia.org"
                    className="flex-1 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    className="border-amber-300 hover:bg-amber-100"
                    disabled={isLoading || !email}
                  >
                    Login
                  </Button>
                </div>
              </form>
            </div>
          )}

          {isDev && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or use OAuth</span>
              </div>
            </div>
          )}

          <Button
            onClick={() => signIn('oasis', { callbackUrl })}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="12" r="10" opacity="0.2" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            Continue with Oasis
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <a href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  )
}
