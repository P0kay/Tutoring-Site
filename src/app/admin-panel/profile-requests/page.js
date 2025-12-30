import { getCurrentUser } from '@/app/lib/auth';
import { getSql } from '@/app/lib/db';
import CheckMarkSvg from '../../../../public/check-mark';
import { revalidatePath } from 'next/cache';
import XMarkSvg from '../../../../public/x-mark';


async function ProfileRequests() {
    const sql = getSql();
    const user_profile_requests = await sql.query(`
      SELECT
        upr.*, u.email
        FROM user_profile_requests upr
        JOIN users u ON upr.user_uuid = u.uuid
    `);

    async function approveRequest(formData) {
        'use server';
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('Unauthorized');
        }
        if (user.type !== 'admin') {
            throw new Error('Forbidden');
        }

        const uprUuid = formData.get('upr_uuid');
        if (!uprUuid || typeof uprUuid !== 'string') {
            throw new Error('Invalid uuid');
        }
        const sql = getSql();

        await sql.transaction([
            sql`
              UPDATE users u
              SET
                first_name = upr.first_name,
                last_name  = upr.last_name,
                birth_date = upr.birth_date,
                education  = upr.education,
                bio        = upr.bio
              FROM user_profile_requests upr
              WHERE upr.user_uuid = u.uuid
                AND upr.uuid = ${uprUuid} AND upr.status = 'pending'
            `,
            sql`
              UPDATE user_profile_requests
              SET
                reviewed_by = ${user.uuid},
                reviewed_at = NOW(),
                status = 'approved'
              WHERE uuid = ${uprUuid} AND status = 'pending'
            `,
        ]);
        revalidatePath('/admin_panel/profile-requests');
    }
    async function declineRequest(formData) {
        'use server';
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('Unauthorized');
        }
        if (user.type !== 'admin') {
            throw new Error('Forbidden');
        }

        const uprUuid = formData.get('upr_uuid');
        if (!uprUuid || typeof uprUuid !== 'string') {
            throw new Error('Invalid uuid');
        }
        const sql = getSql();

        await sql.query(`
            UPDATE user_profile_requests
            SET
                reviewed_by = $1,
                reviewed_at = NOW(),
                status = 'declined'
            WHERE uuid = $2 AND status = 'pending'
            `, [user.uuid, uprUuid]
        );
        revalidatePath('/admin_panel/profile-requests');
    }
    return (
        <div className="mx-auto w-full max-w-7xl">
            <h1 className="text-2xl font-semibold text-slate-900 mb-4">
                Profile Pending Requests
            </h1>

            <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead className="sticky top-0 bg-slate-50">
                            <tr>
                                <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Email
                                </th>
                                <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    First name
                                </th>
                                <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Last name
                                </th>
                                <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Birth date
                                </th>
                                <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Education
                                </th>
                                <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Bio
                                </th>
                                <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Created
                                </th>
                                <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Reviewed at
                                </th>
                                <th className="border-b border-slate-300 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {user_profile_requests.map((upr, idx) => (
                                <tr
                                    key={upr.uuid}
                                    className={[
                                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                                        'transition-colors hover:bg-slate-100',
                                    ].join(' ')}
                                >
                                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-900">
                                        {upr.email}
                                    </td>

                                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-800">
                                        {upr.first_name}
                                    </td>

                                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-800">
                                        {upr.last_name}
                                    </td>

                                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                                        {new Date(upr.birth_date).toLocaleDateString()}
                                    </td>

                                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                                        {upr.education}
                                    </td>

                                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700 max-w-sm truncate">
                                        {upr.bio}
                                    </td>

                                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                                        {new Date(upr.created_at).toLocaleDateString()}
                                    </td>

                                    <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                                        {upr.reviewed_at
                                            ? new Date(upr.reviewed_at).toLocaleDateString()
                                            : '—'}
                                    </td>

                                    <td className="border-b border-slate-200 px-4 py-3 text-center">
                                        {upr.status === 'pending' ? (
                                            <div className="flex justify-center gap-2">
                                                <form action={approveRequest}>
                                                    <input type="hidden" name="upr_uuid" value={upr.uuid} />
                                                    <button
                                                        type="submit"
                                                        className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 transition-colors hover:bg-emerald-100 cursor-pointer"
                                                    >
                                                        <CheckMarkSvg size="22px" />
                                                    </button>
                                                </form>

                                                <form action={declineRequest}>
                                                    <input type="hidden" name="upr_uuid" value={upr.uuid} />
                                                    <button
                                                        type="submit"
                                                        className="rounded-lg border border-rose-200 bg-rose-50 p-2 transition-colors hover:bg-rose-200 cursor-pointer"
                                                    >
                                                        <XMarkSvg size="22px" />
                                                    </button>
                                                </form>
                                            </div>
                                        ) : (
                                            <span
                                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium
                        ${upr.status === 'approved'
                                                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                                        : 'border-rose-300 bg-rose-50 text-rose-700'
                                                    }`}
                                            >
                                                {upr.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}

export default ProfileRequests;