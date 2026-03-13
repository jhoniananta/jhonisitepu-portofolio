import { NextResponse } from 'next/server';

import { verifyAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// GET /api/experiences - Public: fetch all experiences
export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('sort_order', { ascending: true });

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

// POST /api/experiences - Admin only: create a new experience
export async function POST(request: Request) {
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

    if (!company_logo || !position || !company || !duration || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('experiences')
      .insert({
        company_logo,
        position,
        company,
        duration,
        description,
        sort_order: sort_order || 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
