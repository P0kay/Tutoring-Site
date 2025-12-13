import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSql } from '@/app/lib/db';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        const sql = getSql();
        const result = await sql.query(
            `
      SELECT
        uuid,
        password,
        email,
        type,
        birth_date,
        first_name,
        last_name,
        education,
        bio,
        created_at,
        approved_at
      FROM users
      WHERE email = $1
      `,
            [email]
        );

        if (result.length === 0) {
            return NextResponse.json(
                { message: 'Email does not exist' },
                { status: 404 }
            );
        }

        const user = result[0];

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return NextResponse.json(
                { message: 'Incorrect password' },
                { status: 401 }
            );
        }

        const safeUser = {
            uuid: user.uuid,
            email: user.email,
            type: user.type,
            first_name: user.first_name,
            last_name: user.last_name,
            birth_date: user.birth_date,
            education: user.education,
            bio: user.bio,
            created_at: user.created_at,
            approved_at: user.approved_at,
        };
        await sql.query('DELETE FROM sessions WHERE user_uuid = $1', [user.uuid]);
        const sessionId = uuidv4();
        await sql.query(
            `INSERT INTO sessions (uuid, user_uuid, expires_at)
   VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
            [sessionId, user.uuid]
        );
        const cookieStore = await cookies();

        cookieStore.set('session', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });
        return NextResponse.json(
            { user: safeUser },
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
