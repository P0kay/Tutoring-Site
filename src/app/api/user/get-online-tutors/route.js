import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';

export async function GET() {
    try {
        const sql = getSql();
        const onlineTutors = await sql.query(
            `
        SELECT
            approved_at, bio, birth_date, education, first_name, last_name, is_online
        FROM tutor_activity ta
        JOIN users u ON ta.tutor_uuid = u.uuid
        WHERE ta.is_online = true
      `
        );
        return NextResponse.json(
            {
                onlineTutors
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
