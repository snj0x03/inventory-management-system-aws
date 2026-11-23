import { createContext, useContext, useState } from "react";


const AuthContext = createContext(null);


const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        const localUser = localStorage.getItem("user");
        if(!localUser || localUser === "undefined") {
            return null;
        }
        return JSON.parse(localUser);
    });

    const login = (data, token) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", token);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
          {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
