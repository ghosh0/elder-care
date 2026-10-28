import { createAuthClient } from 'better-auth/react'

// In the browser, always use the actual origin so this works on any deployment.
// On the server (SSR), fall back to the env var.
const baseURL =
  typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.BETTER_AUTH_URL ?? 'http://localhost:3000')

export const authClient = createAuthClient({ baseURL })
