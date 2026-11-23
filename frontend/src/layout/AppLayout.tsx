import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import  Sidebar  from "../components/Sidebar";


const AppLayout = () => {
    return (
        <AppShell
            navbar={{
                width: 220,
                breakpoint: "sm",
            }}
            padding="md"
        >
            <AppShell.Navbar p="md">
                <Sidebar />
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}


export default AppLayout;

