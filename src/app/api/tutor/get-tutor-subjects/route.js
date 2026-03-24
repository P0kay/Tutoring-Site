import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';
import unflattenSubjects from '@/app/lib/unflattenSubjects';

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if (user.type !== 'tutor' && user.type !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const sql = getSql();
        const tutorSubjectsRaw = await sql.query(
            `
      SELECT
        s.uuid, s.key,
        tsl.level
        FROM tutor_subject_levels tsl
        JOIN subjects s ON s.uuid = tsl.subject_uuid
        WHERE tsl.tutor_uuid = $1::uuid
      `,
            [user.uuid]
        );
        const tutorSubjects = unflattenSubjects(tutorSubjectsRaw)
        return NextResponse.json(
            {
                tutorSubjects
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
