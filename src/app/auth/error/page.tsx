'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorInfo: Record<string, { title: string; description: string }> = {
    Configuration: {
      title: 'Server Configuration Error',
      description:
        'There is a problem with the server configuration. Please contact support if this persists.',
    },
    AccessDenied: {
      title: 'Access Denied',
      description:
        'You do not have permission to sign in. Please contact an administrator if you believe this is an error.',
    },
    Verification: {
      title: 'Verification Error',
      description:
        'The verification link may have expired or has already been used. Please try signing in again.',
    },
    OAuthSignin: {
      title: 'Sign-in Error',
      description: 'An error occurred while trying to sign in with Oasis. Please try again.',
    },
    OAuthCallback: {
      title: 'Authentication Error',
      description:
        'There was an error during the authentication process. Please try signing in again.',
    },
    OAuthCreateAccount: {
      title: 'Account Creation Error',
      description: 'Could not create your account. Please try again or contact support.',
    },
    OAuthAccountNotLinked: {
      title: 'Account Not Linked',
      description:
        'This email is already associated with another sign-in method. Please use your original sign-in method.',
    },
    Default: {
      title: 'Authentication Error',
      description: 'An unexpected error occurred during authentication. Please try again.',
    },
  }

  const { title, description } = errorInfo[error || 'Default'] || errorInfo.Default

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-destructive/5 via-background to-red-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-8 w-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border bg-muted/50 p-3 text-center">
              <span className="text-xs text-muted-foreground">Error code: </span>
              <code className="text-xs font-mono">{error}</code>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/auth/signin">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
