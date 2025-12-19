import { getCurrentUser } from '@/app/lib/auth';
import { getSql } from '@/app/lib/db';


async function ProfileRequests() {
    const sql = getSql();
    const users = await sql.query(`
      SELECT
        upr.*, u.email
        FROM user_profile_requests upr
        JOIN users u ON upr.user_uuid = u.uuid
    `);
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Profile pending Requests</h1>
            <table>
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-3 py-2 text-left">Request UUID</th>
                        <th className="border px-3 py-2 text-left">User UUID</th>
                        <th className="border px-3 py-2 text-left">Email</th>
                        <th className="border px-3 py-2 text-left">First Name</th>
                        <th className="border px-3 py-2 text-left">Last Name</th>
                        <th className="border px-3 py-2 text-left">Birth Date</th>
                        <th className="border px-3 py-2 text-left">Education</th>
                        <th className="border px-3 py-2 text-left">Bio</th>
                        <th className="border px-3 py-2 text-left">Created At</th>
                        <th className="border px-3 py-2 text-left">Reviewed By</th>
                        <th className="border px-3 py-2 text-left">Reviewed At</th>
                        <th className="border px-3 py-2 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.uuid}>
                            <td className="border px-3 py-2">{u.uuid}</td>
                            <td className="border px-3 py-2">{u.user_uuid}</td>
                            <td className="border px-3 py-2">{u.email}</td>
                            <td className="border px-3 py-2">{u.first_name}</td>
                            <td className="border px-3 py-2">{u.last_name}</td>
                            <td className="border px-3 py-2">{new Date(u.birth_date).toLocaleDateString()}</td>
                            <td className="border px-3 py-2">{u.education}</td>
                            <td className="border px-3 py-2">{u.bio}</td>
                            <td className="border px-3 py-2">{new Date(u.created_at).toLocaleDateString()}</td>
                            <td className="border px-3 py-2">{u.reviewed_by}</td>
                            <td className="border px-3 py-2">{u.reviewed_at !== null ? new Date(u.reviewed_at).toLocaleDateString() : ''}</td>
                            <td className="border px-3 py-2">{u.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProfileRequests;