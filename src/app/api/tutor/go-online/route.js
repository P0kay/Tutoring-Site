import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';
import flattenSubjects from '@/app/lib/flattenSubjects';

export async function PATCH(req) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if ((user.type !== 'tutor' && user.type !== 'admin') || user.approved_at === null) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
        const tutorSubjects = await req.json();
        const rawTutorSubjects = flattenSubjects(user.uuid, tutorSubjects.subjects)
        const userUuids = rawTutorSubjects.map(r => r[0]);
        const subjectIds = rawTutorSubjects.map(r => r[1]);
        const levels = rawTutorSubjects.map(r => r[2]);

        const sql = getSql();
        await sql.query(
            `
            UPDATE
              tutor_activity
            SET
              is_online=TRUE
            WHERE
              tutor_uuid = $1::uuid
            `,
            [user.uuid]
        );

        await sql.query(
            `
            DELETE FROM
                tutor_online_subjects
            WHERE
                user_uuid = $1::uuid;
            `,
            [user.uuid]
        )
        await sql.query(
            `
            INSERT INTO tutor_online_subjects (user_uuid, subject_uuid, level)
            SELECT *
            FROM UNNEST ($1::uuid[], $2::uuid[], $3::text[])
            `,
            [userUuids, subjectIds, levels]
        );
        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
