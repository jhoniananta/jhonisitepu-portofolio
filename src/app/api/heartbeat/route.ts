import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

// GET /api/heartbeat - Keep the Supabase database alive
// Called by Vercel Cron every 7 days
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron using the authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createClient();

    // Simple query to keep the database active
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: error.message, status: 'unhealthy' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      records_found: data?.length ?? 0,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error', status: 'unhealthy' },
      { status: 500 },
    );
  }
}
