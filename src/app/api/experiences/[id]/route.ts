import { NextRequest, NextResponse } from 'next/server';

import { verifyAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// PUT /api/experiences/[id] - Admin only: update an experience
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createClient();
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      company_logo,
      position,
      company,
      duration,
      description,
      sort_order,
    } = body;

    const { data, error } = await supabase
      .from('experiences')
      .update({
        company_logo,
        position,
        company,
        duration,
        description,
        sort_order,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// DELETE /api/experiences/[id] - Admin only: delete an experience
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createClient();
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Experience deleted' });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
