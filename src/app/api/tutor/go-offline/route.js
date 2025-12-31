import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';

export async function PATCH() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if ((user.type !== 'tutor' && user.type !== 'admin') || user.approved_at === null) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const sql = getSql();
        await sql.query(
            `
            UPDATE
              tutor_activity
            SET
              is_online=FALSE
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
        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
