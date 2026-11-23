import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react";


const Root = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!user) {
            navigate("/login");
        }

        if(user.role === "admin") {
            navigate("/dashboard");
        } else {
            navigate("/products");
        }
    }, [user, navigate]);

    return null;
}


export default Root;
