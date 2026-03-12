import { createClient } from '@/lib/supabase/server';

/**
 * Verifies that the current user is the admin.
 * Returns the user if authorized, or null if not.
 */
export async function verifyAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && user.email !== adminEmail) return null;

  return user;
}
