import {
    Table,
    Title,
    Group,
    Text,
    Stack,
    Paper,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/env";


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log(user.id);
                const response = await fetch(`${API_URL}/order/${user.id}`,{
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const result = await response.json();
                setOrders(result.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);


    const sortedOrders = [...orders].sort(
        (a, b) =>
        new Date(b.orderedDate).getTime() - new Date(a.orderedDate).getTime()
    )


    const rows = sortedOrders.map((order) => (
        <Table.Tr key={order.id}>
            <Table.Td>{order.id}</Table.Td>
            <Table.Td>{order.name}</Table.Td>
            <Table.Td>{order.quantity}</Table.Td>
            <Table.Td>
                {order.totalPrice}
            </Table.Td>
            <Table.Td>
                {new Date(order.orderedDate).toLocaleString("en-US", { 
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit" 
                })}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack>
            <Group justify="space-between">
                <Title order={2}>My Orders</Title>
                <Text c="dimmed" size="sm">
                    {orders.length} orders
                </Text>
            </Group>

            <Paper withBorder radius="md" p="md" shadow="sm">
                {loading ? (
                    <Text>Loading orders...</Text>
                ) : orders.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">
                        You haven't placed any orders yet.
                    </Text>
                ) : (
                    <Table.ScrollContainer minWidth={800}>
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Order ID</Table.Th>
                                    <Table.Th>Product</Table.Th>
                                    <Table.Th>Quantity</Table.Th>
                                    <Table.Th>Total Price</Table.Th>
                                    <Table.Th>Order Date</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {rows}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                )}
            </Paper>
        </Stack>
    );
}


export default Orders;
