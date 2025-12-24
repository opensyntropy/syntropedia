import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyPage() {
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription className="mt-2">
              A verification link has been sent to your email address. Please check
              your inbox and click the link to complete the sign-in process.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Didn&apos;t receive the email?</strong>
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/signin">Back to Sign In</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
