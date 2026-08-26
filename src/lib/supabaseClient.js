import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

let browserClient = null

function getBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabasePublishableKey)
  }
  return browserClient
}

export const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      if (typeof prop === 'symbol') return undefined
      const client = getBrowserClient()
      const value = client[prop]
      return typeof value === 'function' ? value.bind(client) : value
    },
  }
)

export { getBrowserClient }
