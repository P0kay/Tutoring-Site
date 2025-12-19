import Forbidden from "../components/forbidden";
import Unauthorized from "../components/unauthorized";
import { getCurrentUser } from "../lib/auth";

async function TutorPanelLayout({ children }) {
    const user = await getCurrentUser()
    if (!user) {
        return <Unauthorized />
    }
    if (user.type !== 'admin' && user.type !== 'tutor') {
        return <Forbidden />
    }
    return children
}

export default TutorPanelLayout;