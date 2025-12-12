import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ message: 'Missing token' }, { status: 400 });
        }

        const sql = getSql();

        const result = await sql.query(
            `
      SELECT uuid, email, password, type, birth_date FROM user_requests
      WHERE email_verification_token = $1
        AND email_verification_expires > NOW()
      `,
            [token]
        );

        if (result.length === 0) {
            return NextResponse.json(
                { message: 'Invalid or expired token' },
                { status: 400 }
            );
        }

        const user = result[0]
        try {
            await sql.query(
                `
        INSERT INTO users (uuid, email, password, type, birth_date, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        `,
                [user.uuid, user.email, user.password, user.type, user.birth_date]
            );

            await sql.query(
                `
        DELETE FROM user_requests
        WHERE uuid = $1
        `,
                [user.uuid]
            );
        } catch (err) {
            throw err;
        }
        return NextResponse.redirect(new URL('/verified', req.url));
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
