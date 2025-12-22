import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import OasisProvider from '@/lib/auth/oasis-provider'

const isDev = process.env.NODE_ENV === 'development'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    OasisProvider({
      clientId: process.env.OASIS_CLIENT_ID!,
      clientSecret: process.env.OASIS_CLIENT_SECRET!,
      issuer: process.env.OASIS_ISSUER_URL!,
    }),
    // Dev-only credentials provider for quick local testing
    ...(isDev
      ? [
          CredentialsProvider({
            id: 'dev-credentials',
            name: 'Development Login',
            credentials: {
              email: { label: 'Email', type: 'email', placeholder: 'user@syntropedia.org' },
            },
            async authorize(credentials) {
              if (!credentials?.email) return null
              const user = await prisma.user.findUnique({
                where: { email: credentials.email },
              })
              if (!user) return null
              // Check if user is blocked
              if (user.status === 'BLOCKED') return null
              // Transform null to undefined for NextAuth compatibility
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role,
                discourseId: user.discourseId ?? undefined,
              }
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  callbacks: {
    async signIn({ user }) {
      // Check if user is blocked
      if (user?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { status: true },
        })
        if (dbUser?.status === 'BLOCKED') {
          return '/auth/error?error=blocked'
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role ?? 'USER'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      // Sync Oasis user data
      if (account?.provider === 'oasis' && profile) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            avatar: (profile as any).picture || (profile as any).avatar_url,
          },
        })
      }
    },
  },
}
