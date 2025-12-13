import { cookies } from 'next/headers';
import { getSql } from '@/app/lib/db';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;
  if (!sessionId) return null;

  const sql = getSql();

  // If you store sessions.uuid as UUID, cast $1::uuid
  const rows = await sql.query(
    `
    SELECT u.uuid, u.email, u.type
    FROM sessions s
    JOIN users u ON u.uuid = s.user_uuid
    WHERE s.uuid = $1::uuid
      AND (s.expires_at IS NULL OR s.expires_at > NOW())
    LIMIT 1
    `,
    [sessionId]
  );

  return rows.length ? rows[0] : null;
}
