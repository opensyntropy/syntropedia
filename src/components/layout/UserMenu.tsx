'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { User, Settings, LogOut, FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserMenu() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
    )
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="rounded-full border-2 border-primary-600 text-primary-600 hover:bg-primary-50"
          asChild
        >
          <Link href="/auth/signin">Login</Link>
        </Button>
        <Button
          className="rounded-full bg-primary-600 text-white hover:bg-primary-700"
          asChild
        >
          <a
            href={`${process.env.NEXT_PUBLIC_OASIS_URL || 'http://localhost:3001'}/register`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Create Account
          </a>
        </Button>
      </div>
    )
  }

  const userInitials = session.user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0"
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User avatar'}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
              {userInitials}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/submissions/new" className="flex cursor-pointer items-center">
            <Plus className="mr-2 h-4 w-4" />
            <span>Submit Species</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/submissions" className="flex cursor-pointer items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>My Submissions</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex cursor-pointer items-center">
            <User className="mr-2 h-4 w-4" />
            <span>My Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/settings" className="flex cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
