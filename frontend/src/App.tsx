import { BrowserRouter as Router, Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register"
import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import Root from "./components/Root";
import Orders from "./pages/Order";
import ProtectedRoutes from "./utils/ProtectedRoutes";


function App() {
    return (
        <Router>
            <Routes>
                {/* Unauthroized Page */}
                <Route path="/unauthorized" element={<p>Unauthroized</p>} />

                {/* Authentication Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Application Routes */}
                <Route element={<AppLayout />}>
                    <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/inventory" element={<Inventory />} />
                    </Route>
                    <Route element={<ProtectedRoutes allowedRoles={["admin", "customer"]} />}>
                        <Route path="/" element={<Root />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/orders" element={<Orders />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    )
}


export default App;
