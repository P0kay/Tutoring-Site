import { headers } from 'next/headers';
import { getSql } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

async function AdminPanel() {
    const h = await headers();
    const host = h.get('host');
    const proto = h.get('x-forwarded-proto') || 'http';

    const sql = getSql();
    const users = await sql.query(`
      SELECT
        uuid,
        email,
        type,
        first_name,
        last_name,
        birth_date,
        education,
        created_at,
        approved_at
      FROM users
    `);

    async function approveUser(formData) {
        'use server';

        const uuid = formData.get('uuid');
        const sql = getSql();

        await sql.query(
            'UPDATE users SET approved_at = NOW() WHERE uuid = $1 AND approved_at IS NULL',
            [uuid]
        );
        revalidatePath('/admin_panel');
    }
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Users</h1>

            <table>
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-3 py-2 text-left">UUID</th>
                        <th className="border px-3 py-2 text-left">Email</th>
                        <th className="border px-3 py-2 text-left">Type</th>
                        <th className="border px-3 py-2 text-left">Birth Date</th>
                        <th className="border px-3 py-2 text-left">Creation Time</th>
                        <th className="border px-3 py-2 text-left">Approved</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.uuid}>
                            <td className="border px-3 py-2">{u.uuid}</td>
                            <td className="border px-3 py-2">{u.email}</td>
                            <td className="border px-3 py-2">{u.type}</td>
                            <td className="border px-3 py-2">{new Date(u.birth_date).toLocaleDateString()}</td>
                            <td className="border px-3 py-2">{new Date(u.created_at).toLocaleDateString()}</td>
                            <td className="border px-3 py-2">
                                {u.approved_at === null ?
                                    <form action={approveUser}>
                                        <input type="hidden" name="uuid" value={u.uuid} />
                                        <button
                                            type="submit"
                                            className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                    </form> :
                                    <>{u.approved_at.toLocaleDateString()}</>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPanel;