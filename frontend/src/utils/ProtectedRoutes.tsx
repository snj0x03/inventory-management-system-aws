import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";


const ProtectedRoutes = ({ allowedRoles }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!user) {
            navigate("/login");
            return;
        }

        if(!allowedRoles.includes(user.role)) {
            navigate("/unauthorized");
            return;
        }
    }, [user, navigate, allowedRoles]);

    if(!user) return null;

    if(!allowedRoles.includes(user.role)) return null;
    else return(<Outlet />);
} 


export default ProtectedRoutes;
