import {createContext, useContext, useState} from "react";

const UserContext = createContext(null)

const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState('');
    const [loggedIn, setLoggedIn]= useState(false);
    const [username, setUsername]= useState('')
    return (
        //This component will be used to encapsulate the whole App,
        //so all components will have access to the Context
        <UserContext.Provider
            value={{
                userRole,
                setUserRole,
                loggedIn,
                setLoggedIn,
                username,
                setUsername
            }}>
            {children}
        </UserContext.Provider>
    )
}
const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("useUser must be used within an UserProvider")
    }
    return context
}
export { UserContext, UserProvider, useUser }
