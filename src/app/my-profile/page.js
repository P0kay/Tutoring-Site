import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/auth';
import { getSql } from '@/app/lib/db';

async function MyProfile() {
    const user = await getCurrentUser()
    if (!user) redirect('/signin');
    const sql = getSql();
    const rows = await sql.query(
        `
    SELECT email, type, first_name, last_name, birth_date, education, bio, created_at, approved_at
    FROM users
    WHERE uuid = $1::uuid
    LIMIT 1
    `,
        [user.uuid]
    );

    if (rows.length === 0) redirect('/signin'); // session exists but user deleted

    const userData = rows[0];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-3xl px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Update your personal information and profile details.
                    </p>
                    <img src="/blank_profile_picture.png" alt="Blank profile picture" className='w-50 h-50' />
                </div>

                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Profile details</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Fields below are editable (UI only for now).
                            </p>
                        </div>

                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                            {userData.type}
                        </span>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* Email */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    defaultValue={userData.email || ""}
                                    type="email"
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                             shadow-sm outline-none transition
                             focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* First name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First name</label>
                                <input
                                    defaultValue={userData.first_name || ""}
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
                                    defaultValue={userData.last_name || ""}
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
                                    defaultValue={userData.birth_date}
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
                                    defaultValue={userData.education || ""}
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
                                    defaultValue={userData.bio || ""}
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
                                    {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : "-"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <p className="text-xs font-medium text-gray-500">Approved since</p>
                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {userData.approved_at ? new Date(userData.approved_at).toLocaleDateString() : "-"}
                                </p>
                            </div>
                        </div>

                        {/* Actions (UI only) */}
                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5
                           text-sm font-medium text-gray-700 shadow-sm transition
                           hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5
                           text-sm font-medium text-white shadow-sm transition
                           hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;