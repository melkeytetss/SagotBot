import { createBrowserClient } from "@supabase/ssr";

/** Browser Supabase client. The SDK caches a single instance per tab. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
