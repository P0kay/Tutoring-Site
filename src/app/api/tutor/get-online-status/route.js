import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if ((user.type !== 'tutor' && user.type !== 'admin') || user.approved_at === null) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const sql = getSql();
        const isOnline = await sql.query(
            `
            SELECT is_online
            FROM tutor_activity
            WHERE tutor_uuid = $1::uuid
            `,
            [user.uuid]
        );
        if (isOnline.length > 0) {
            return NextResponse.json(
                isOnline[0],
                { status: 200 }
            );
        }
        return NextResponse.json(
            { message: "User doesn't exist" },
            { status: 404 }
        )
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
