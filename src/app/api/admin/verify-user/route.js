import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';

export async function PATCH(req) {
    try {
        const adminKey = req.headers.get('x-admin-key');
        if (!process.env.ADMIN_API_KEY || adminKey !== process.env.ADMIN_API_KEY) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }
        const { uuid } = await req.json();
        const sql = getSql();
        await sql.query(`
        UPDATE users
        SET approved_at = NOW()
        WHERE uuid = $1;
    `, [uuid]);

        return NextResponse.json(
            { status: 200 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
