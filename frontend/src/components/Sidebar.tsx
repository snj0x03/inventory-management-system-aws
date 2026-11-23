import {
    Box,
    NavLink,
    Stack,
    Text,
    Group,
    ThemeIcon,
    Divider,
} from "@mantine/core";
import {
    IconGauge,
    IconPackage,
    IconShoppingCart,
    IconClipboardList,
    IconHome,
    IconLogout,
    IconBuildingWarehouse,
} from "@tabler/icons-react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const adminData = [
    { link: "/", label: "Home", icon: IconHome },
    { link: "/dashboard", label: "Dashboard", icon: IconGauge },
    { link: "/inventory", label: "Inventory", icon: IconBuildingWarehouse },
    { link: "/products", label: "Products", icon: IconPackage },
    { link: "/orders", label: "Orders", icon: IconShoppingCart },
];


const customerData = [
    { link: "/", label: "Home", icon: IconHome },
    { link: "/products", label: "Products", icon: IconPackage },
    { link: "/orders", label: "Orders", icon: IconClipboardList },
];


export default function Sidebar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const data = user?.role === "admin" ? adminData : customerData;

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <Stack h="100%" gap="sm">

            {/* Logo */}
            <Group gap="sm" px="xs" py="sm">
                <ThemeIcon
                    size={42}
                    radius="md"
                    variant="filled"
                    color="blue"
                >
                    <IconBuildingWarehouse size={26} />
                </ThemeIcon>

                <Box>
                    <Text fw={700} size="lg" lh={1.2}>
                       Minimal 
                    </Text>
                    <Text size="xs" c="dimmed">
                        Inventory Management
                    </Text>
                </Box>
            </Group>

            <Divider />

            {/* Navigation */}
            <Box>
                <Stack gap={4}>
                    {data.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.link}
                                component={RouterNavLink}
                                to={item.link}
                                label={item.label}
                                leftSection={<Icon size={20} />}
                                active={undefined}
                                variant="light"
                                color="blue"
                                styles={{
                                    root: {
                                        fontWeight: 500,
                                    },
                                }}
                            />
                        );
                    })}
                </Stack>
            </Box>

            <Box style={{ flex: 1 }} />

            <Divider />

            {/* Logout */}
            <NavLink
                label="Logout"
                leftSection={<IconLogout size={20} />}
                color="red"
                variant="light"
                onClick={handleLogout}
            />

        </Stack>
    );
}

