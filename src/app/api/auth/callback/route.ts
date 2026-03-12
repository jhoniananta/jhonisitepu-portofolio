import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

// GET /api/auth/callback - Handle OAuth callback from Google
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/admin/dashboard';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
}
