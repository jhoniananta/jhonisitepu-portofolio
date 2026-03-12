import { NextRequest, NextResponse } from 'next/server';

import { verifyAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// PUT /api/projects/[id] - Admin only: update a project
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
    const { title, description, image_url, link_url, tech_stack, sort_order } =
      body;

    const { data, error } = await supabase
      .from('projects')
      .update({
        title,
        description,
        image_url,
        link_url,
        tech_stack,
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

// DELETE /api/projects/[id] - Admin only: delete a project
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
      .from('projects')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Project deleted' });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
