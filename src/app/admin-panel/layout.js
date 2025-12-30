import Link from "next/link";
import Forbidden from "../components/forbidden";
import Unauthorized from "../components/unauthorized";
import { getCurrentUser } from "../lib/auth";

async function AdminPanelLayout({ children }) {
    const baseLink = "/admin-panel";
    const user = await getCurrentUser()
    if (!user) {
        return <Unauthorized />
    }
    if (user.type !== 'admin') {
        return <Forbidden />
    }
    return (
        <>
            <div className="mt-10 flex gap-2 rounded-lg border border-slate-300 bg-white p-1 shadow-sm mb-10">
                <Link
                    href={`${baseLink}/users`}
                    className="rounded-md px-4 py-2 text-sm font-medium text-slate-700
               transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                    Users
                </Link>

                <Link
                    href={`${baseLink}/profile-requests`}
                    className="rounded-md px-4 py-2 text-sm font-medium text-slate-700
               transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                    Profile requests
                </Link>
            </div>
            {children}
        </>
    );
}

export default AdminPanelLayout;