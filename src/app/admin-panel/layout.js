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
            <div className="flex gap-5 mt-10">
                <Link href={`${baseLink}/users`} className="border-2 rounded p-1">Users</Link>
                <Link href={`${baseLink}/profile-requests`} className="border-2 rounded p-1">Profile requests</Link>
            </div>
            {children}
        </>
    );
}

export default AdminPanelLayout;