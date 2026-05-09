import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getSql } from '@/app/lib/db';
import { getBaseUrl } from '@/app/lib/url-generation';



export async function POST(req) {
    try {
        async function sendVerificationEmail(email, token) {
            const baseUrl = getBaseUrl(req);
            const link = `${baseUrl}/api/auth/verify-email?token=${token}`;
            console.log(`Verify email for ${email}: ${link}`);
        }
        const { email, password, type, birth_date } = await req.json();

        const sql = getSql();
        const existingUser = await sql.query(
            'SELECT uuid FROM users WHERE email = $1',
            [email]
        );

        if (!email || !password || !type || (!birth_date && type === 'tutor')) {
            return NextResponse.json(
                { message: 'Please provide required information' },
                { status: 400 }
            );
        }

        if (existingUser.length > 0) {
            return NextResponse.json(
                { message: 'Email already exists' },
                { status: 409 }
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
        await sql.query(
            `
      INSERT INTO user_requests
      (uuid, email, password, type, birth_date, email_verification_token, email_verification_expires)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
            [uuidv4(), email, hashedPassword, type, birth_date, token, expires]
        );
        await sendVerificationEmail(email, token);
        return NextResponse.json(
            { success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}