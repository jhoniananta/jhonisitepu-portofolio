import { NextResponse } from 'next/server';

import { verifyAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// PUT /api/experiences/reorder - Admin only: batch update sort_order
export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items: { id: string; sort_order: number }[] = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid payload, expected array' },
        { status: 400 },
      );
    }

    // Perform batched updates
    const updates = items.map((item) =>
      supabase
        .from('experiences')
        .update({ sort_order: item.sort_order })
        .eq('id', item.id),
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
