import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSql } from '@/app/lib/db';

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
