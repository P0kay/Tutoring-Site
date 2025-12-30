import { getCurrentUser } from '@/app/lib/auth';
import { getSql } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import XMarkSvg from '../../../../public/x-mark';
import CheckMarkSvg from '../../../../public/check-mark';

async function Users() {
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

        const user = await getCurrentUser();
        if (!user) throw new Error('Unauthorized');
        if (user.type !== 'admin') throw new Error('Forbidden');

        const uuid = formData.get('uuid');
        if (!uuid || typeof uuid !== 'string') throw new Error('Invalid uuid');

        const sql = getSql();
        await sql.query(
            'UPDATE users SET approved_at = NOW() WHERE uuid = $1 AND approved_at IS NULL',
            [uuid]
        );
        revalidatePath('/admin_panel');
    }

    async function removeUser(formData) {
        'use server';

        const user = await getCurrentUser();
        if (!user) throw new Error('Unauthorized');
        if (user.type !== 'admin') throw new Error('Forbidden');

        const uuid = formData.get('uuid');
        if (!uuid || typeof uuid !== 'string') throw new Error('Invalid uuid');

        const sql = getSql();
        await sql.query('DELETE FROM users WHERE uuid = $1', [uuid]);
        revalidatePath('/admin_panel');
    }

    return (
        <div className="">
            <h1 className="text-2xl font-semibold text-slate-900 mb-4">
                User Pending Requests
            </h1>
            <div className="overflow-x-auto overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
                <table className="min-w-full border-collapse">
                    <thead className="sticky top-0 bg-slate-50">
                        <tr>
                            <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Email
                            </th>
                            <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Type
                            </th>
                            <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Birth date
                            </th>
                            <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Created
                            </th>
                            <th className="border-b border-slate-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Approved
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u, idx) => (
                            <tr
                                key={u.uuid}
                                className={[
                                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                                    'transition-colors hover:bg-slate-100',
                                ].join(' ')}
                            >

                                <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-900">
                                    {u.email}
                                </td>

                                <td className="border-b border-slate-200 px-4 py-3">
                                    <span className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                                        {u.type}
                                    </span>
                                </td>

                                <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                                    {u.birth_date
                                        ? new Date(u.birth_date).toLocaleDateString()
                                        : '—'}
                                </td>

                                <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-700">
                                    {u.created_at
                                        ? new Date(u.created_at).toLocaleDateString()
                                        : '—'}
                                </td>

                                <td className="border-b border-slate-200 px-4 py-3">
                                    {u.approved_at === null ? (
                                        <div className="flex gap-2">
                                            <form action={approveUser}>
                                                <input type="hidden" name="uuid" value={u.uuid} />
                                                <button
                                                    type="submit"
                                                    className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 transition-colors hover:bg-emerald-100 cursor-pointer"
                                                >
                                                    <CheckMarkSvg size="22px" />
                                                </button>
                                            </form>

                                            <form action={removeUser}>
                                                <input type="hidden" name="uuid" value={u.uuid} />
                                                <button
                                                    type="submit"
                                                    className="rounded-lg border border-rose-200 bg-rose-50 p-2 transition-colors hover:bg-rose-200 cursor-pointer"
                                                >
                                                    <XMarkSvg size="22px" />
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                            {new Date(u.approved_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default Users;
