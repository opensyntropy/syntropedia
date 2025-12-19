import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/oauth'

interface OasisProfile {
  sub: string  // User ID in Oasis
  name: string
  email: string
  email_verified?: boolean
  picture?: string
  preferred_username?: string
}

export default function OasisProvider(
  options: OAuthUserConfig<OasisProfile> & {
    issuer: string
  }
): OAuthConfig<OasisProfile> {
  const { issuer } = options

  return {
    id: 'oasis',
    name: 'Oasis',
    type: 'oauth',
    authorization: {
      url: `${issuer}/oidc/auth`,
      params: {
        scope: 'openid email profile',
      },
    },
    token: {
      url: `${issuer}/oidc/token`,
      async request(context) {
        const { params, provider } = context
        const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/oasis`

        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          code: params.code as string,
          redirect_uri: redirectUri,
          client_id: options.clientId as string,
          client_secret: options.clientSecret as string,
        })

        console.log('[Oasis] Token request to:', `${issuer}/oidc/token`)
        console.log('[Oasis] Token request body:', body.toString())

        const response = await fetch(`${issuer}/oidc/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        })

        const tokens = await response.json()
        console.log('[Oasis] Token response:', JSON.stringify(tokens, null, 2))

        if (tokens.error) {
          throw new Error(`Token error: ${tokens.error} - ${tokens.error_description}`)
        }

        // Return tokens without id_token to avoid JWKS validation
        return {
          tokens: {
            access_token: tokens.access_token,
            token_type: tokens.token_type,
            expires_at: tokens.expires_at,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope,
          },
        }
      },
    },
    userinfo: {
      url: `${issuer}/oidc/me`,
      async request({ tokens }) {
        console.log('[Oasis] Userinfo request with token:', tokens.access_token?.substring(0, 20) + '...')
        const res = await fetch(`${issuer}/oidc/me`, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        })
        const profile = await res.json()
        console.log('[Oasis] Userinfo response:', JSON.stringify(profile, null, 2))
        return profile
      },
    },
    checks: ['state'],
    async profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture ?? null,
      }
    },
    options,
  }
}
