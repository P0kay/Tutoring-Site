import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const subject = searchParams.get('subject').toUpperCase()

        const sql = getSql();
        const onlineTutors = await sql.query(
            `
        SELECT DISTINCT ON (u.uuid)
            u.uuid, u.first_name, u.last_name, ta.is_online
        FROM tutor_activity ta
        JOIN users u ON ta.tutor_uuid = u.uuid
        JOIN tutor_online_subjects tos ON u.uuid = tos.user_uuid
        JOIN subjects s ON s.uuid = tos.subject_uuid
        WHERE s.key = $1
      `, [subject]
        );
        console.log(onlineTutors)
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
