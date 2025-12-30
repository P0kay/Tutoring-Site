import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/auth';
import { getSql } from '@/app/lib/db';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

function toDateInputValue(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    console.log(d)
    console.log(d.toDateString())

    return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default async function MyProfile() {
    const user = await getCurrentUser();
    if (!user) redirect('/signin');

    const sql = getSql();

    const rows = await sql.query(
        `
        SELECT uuid, email, type, first_name, last_name, birth_date, education, bio, created_at, approved_at
        FROM users
        WHERE uuid = $1::uuid
        LIMIT 1
        `,
        [user.uuid]
    );

    if (rows.length === 0) redirect('/signin');
    const userData = rows[0];

    async function submitProfileRequest(formData) {
        'use server';

        const user = await getCurrentUser();
        if (!user) redirect('/signin');

        const first_name = (formData.get('first_name') || '').toString().trim();
        const last_name = (formData.get('last_name') || '').toString().trim();
        const birth_date = (formData.get('birth_date') || '').toString().trim(); // 'YYYY-MM-DD' or ''
        const education = (formData.get('education') || '').toString().trim();
        const bio = (formData.get('bio') || '').toString().trim();

        const sql = getSql();

        const uprUuid = uuidv4();

        await sql.query(
            `
        INSERT INTO user_profile_requests
            (uuid, user_uuid, first_name, last_name, birth_date, education, bio, created_at, status)
        VALUES
            ($1::uuid, $2::uuid, $3, $4, NULLIF($5, '')::date, $6, $7, NOW(), 'pending')
        `,
            [uprUuid, user.uuid, first_name, last_name, birth_date, education, bio]
        );

        redirect('/my-profile?requested=1');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-3xl px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Update your personal information and profile details.
                    </p>
                    <img
                        src="/blank_profile_picture.png"
                        alt="Blank profile picture"
                        className="mt-4 h-32 w-32 rounded-full border object-cover"
                    />
                </div>

                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                    <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Profile details</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Changes will be sent for admin approval.
                            </p>
                        </div>

                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                            {userData.type}
                        </span>
                    </div>

                    {/* ✅ This form submits to user_profile_requests */}
                    <form action={submitProfileRequest} className="p-6">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* Email (read-only) */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    value={userData.email}
                                    readOnly
                                    type="email"
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900
                             shadow-sm outline-none"
                                />
                            </div>

                            {/* First name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First name</label>
                                <input
                                    name="first_name"
                                    defaultValue={userData.first_name}
                                    type="text"
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                             shadow-sm outline-none transition
                             focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    placeholder="John"
                                />
                            </div>

                            {/* Last name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last name</label>
                                <input
                                    name="last_name"
                                    defaultValue={userData.last_name}
                                    type="text"
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                             shadow-sm outline-none transition
                             focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    placeholder="Doe"
                                />
                            </div>

                            {/* Birth date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Birth date</label>
                                <input
                                    name="birth_date"
                                    defaultValue={toDateInputValue(userData.birth_date)}
                                    type="date"
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                             shadow-sm outline-none transition
                             focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                />
                            </div>

                            {/* Education */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Education</label>
                                <input
                                    name="education"
                                    defaultValue={userData.education || ''}
                                    type="text"
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                             shadow-sm outline-none transition
                             focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    placeholder="e.g. High School / BSc / MSc"
                                />
                            </div>

                            {/* Bio */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Bio</label>
                                <textarea
                                    name="bio"
                                    defaultValue={userData.bio || ''}
                                    rows={4}
                                    className="mt-2 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                             shadow-sm outline-none transition
                             focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    placeholder="Write something about yourself..."
                                />
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <p className="text-xs font-medium text-gray-500">User since</p>
                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : '-'}
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <p className="text-xs font-medium text-gray-500">Approved since</p>
                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {userData.approved_at ? new Date(userData.approved_at).toLocaleDateString() : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href="/my-profile"
                                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5
                                text-sm font-medium text-gray-700 shadow-sm transition
                                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5
                                text-sm font-medium text-white shadow-sm transition
                                hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                            >
                                Save changes (send for approval)
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}