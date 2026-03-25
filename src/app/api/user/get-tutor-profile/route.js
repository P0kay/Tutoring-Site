import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tutorUuid = (searchParams.get('tutor') || '').trim();

    if (!tutorUuid) {
      return NextResponse.json(
        { message: 'Tutor id is required' },
        { status: 400 }
      );
    }

    const sql = getSql();
    const rows = await sql.query(
      `
        SELECT DISTINCT ON (u.uuid)
          u.uuid,
          u.first_name,
          u.last_name,
          u.education,
          u.bio,
          ta.is_online
        FROM users u
        JOIN tutor_activity ta ON ta.tutor_uuid = u.uuid
        WHERE u.uuid = $1::uuid
          AND u.approved_at IS NOT NULL
          AND u.type IN ('tutor', 'admin')
        LIMIT 1
      `,
      [tutorUuid]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Tutor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ tutor: rows[0] }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
