import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSql } from '@/app/lib/db';
import { getBaseUrl } from '@/app/lib/url-generation';

export async function POST(req) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (sessionId) {
        const sql = getSql();
        await sql.query('DELETE FROM sessions WHERE uuid = $1::uuid', [sessionId]);
    }

    cookieStore.set('session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    return NextResponse.redirect(`${getBaseUrl(req)}/`);
}
