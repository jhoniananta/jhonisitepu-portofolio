import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

// POST /api/auth/signout - Sign out the user
export async function POST() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ message: 'Signed out' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 },
    );
  }
}
