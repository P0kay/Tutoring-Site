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
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Profile pending Requests</h1>
            <table>
                <thead className="bg-gray-100">
                    <tr>
                        {/* <th className="border px-2 py-1 text-left">Request UUID</th> */}
                        <th className="border px-2 py-1 text-left">Email</th>
                        <th className="border px-2 py-1 text-left">First Name</th>
                        <th className="border px-2 py-1 text-left">Last Name</th>
                        <th className="border px-2 py-1 text-left">Birth Date</th>
                        <th className="border px-2 py-1 text-left">Education</th>
                        <th className="border px-2 py-1 text-left">Bio</th>
                        <th className="border px-2 py-1 text-left">Created At</th>
                        <th className="border px-2 py-1 text-left">Reviewed By</th>
                        <th className="border px-2 py-1 text-left">Reviewed At</th>
                        <th className="border px-2 py-1 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {user_profile_requests.map((upr) => (
                        <tr key={upr.uuid}>
                            {/* <td className="border px-3 py-2">{upr.uuid}</td> */}
                            <td className="border px-3 py-2">{upr.email}</td>
                            <td className="border px-3 py-2">{upr.first_name}</td>
                            <td className="border px-3 py-2">{upr.last_name}</td>
                            <td className="border px-3 py-2">{new Date(upr.birth_date).toLocaleDateString()}</td>
                            <td className="border px-3 py-2">{upr.education}</td>
                            <td className="border px-3 py-2">{upr.bio}</td>
                            <td className="border px-3 py-2">{new Date(upr.created_at).toLocaleDateString()}</td>
                            <td className="border px-3 py-2">{upr.reviewed_by}</td>
                            <td className="border px-3 py-2">{upr.reviewed_at !== null ? new Date(upr.reviewed_at).toLocaleDateString() : ''}</td>
                            <td className="border px-3 py-2 text-center">
                                {upr.status === 'pending' ?
                                    <div className='flex gap-1'>
                                        <form action={approveRequest}>
                                            <input type="hidden" name="upr_uuid" value={upr.uuid} />
                                            <button
                                                type="submit"
                                                className="rounded-lg p-2 text-white hover:bg-emerald-200"
                                            >
                                                <CheckMarkSvg size='30px' />
                                            </button>
                                        </form>
                                        <form action={declineRequest}>
                                            <input type="hidden" name="upr_uuid" value={upr.uuid} />
                                            <button
                                                type="submit"
                                                className="rounded-lg p-2 text-white hover:bg-rose-300"
                                            >
                                                <XMarkSvg size='30px' />
                                            </button>
                                        </form>

                                    </div> :
                                    <span className={`${upr.status === 'approved' ? `text-green-800` : `text-red-700`} font-bold`}>{upr.status}</span>
                                }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProfileRequests;