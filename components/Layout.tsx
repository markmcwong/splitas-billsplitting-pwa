import { useSession, signOut } from 'next-auth/react'
import BottomAppBar from "./BottomAppBar";
import TopAppBar from "./AppBar";
import { AppRoutesValues } from "../utils/urls";

const Layout = ({ children }) => {
    const { data: session, status } = useSession({required: true});
    if (status === 'authenticated') {
        return (
            <div>
                <TopAppBar />
                <BottomAppBar routeValue={AppRoutesValues.Activity} />
                {children}
            </div>
        )
    } else {
        return (
            <div>
                <p>You are not signed in.</p>
            </div>
        )
    }

}

export default Layout
