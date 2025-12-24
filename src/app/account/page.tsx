'use client'

import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Shield, ArrowLeft, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AccountPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin?callbackUrl=/account')
  }

  const userInitials = session.user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-syntropy-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Syntropedia
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-destructive hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User avatar'}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-lg"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white ring-4 ring-white shadow-lg">
                {userInitials}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.user.name}
              </h1>
              <p className="text-muted-foreground">{session.user.email}</p>
            </div>
          </div>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details from Oasis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {session.user.name || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {session.user.role?.toLowerCase() || 'User'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                To update your profile information, please visit your Oasis account settings.
              </p>
              <Button variant="outline" asChild>
                <a
                  href={process.env.NEXT_PUBLIC_OASIS_URL || 'http://localhost:3001'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Manage Oasis Account
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
