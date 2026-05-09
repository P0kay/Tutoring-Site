import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';
import unflattenSubjects from '@/app/lib/unflattenSubjects';

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const tutorUuid = searchParams.get('tutor')
    try {
        const sql = getSql();
        const tutorPrice = await sql.query(
            `
      SELECT
        s.key,
        tsl.price,
        tsl.level
        FROM tutor_online_subjects tos
        JOIN tutor_subject_levels tsl ON tsl.subject_uuid = tos.subject_uuid AND tsl.level = tos.level
        JOIN subjects s ON s.uuid = tsl.subject_uuid
        WHERE tsl.tutor_uuid = $1::uuid
      `,
            [tutorUuid]
        );
        return NextResponse.json(
            {
                tutorPrice
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
