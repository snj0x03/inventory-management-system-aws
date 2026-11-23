import {
    Card,
    Text,
    Group,
    Badge,
    Stack,
    Divider,
    ScrollArea
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { API_URL } from '../config/env';


export default function LowStockCard() {
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {
        const getLowStock = async () => {
            try {
                const response = await fetch(`${API_URL}/dashboard/lowStock`,{
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                const result = await response.json();
                setLowStockProducts(result.data);
            } catch (error) {
                console.error(error);
            }
        };

        getLowStock();
        console.log(lowStockProducts);
    }, []);

    return (
        <Card withBorder shadow="sm" radius="md" padding="lg">
            <Group justify="space-between" mb="md">
                <Group gap="xs">
                    <IconAlertTriangle color="orange" size={22} />
                    <Text fw={700} size="lg">
                        Low Stock Items
                    </Text>
                </Group>

            </Group>

            <Divider mb="sm" />

            {lowStockProducts.length === 0 ? (
                <Text c="dimmed" ta="center" py="lg">
                    No low stock products.
                </Text>
            ) : (
                <ScrollArea h={250} scrollbarSize={4} offsetScrollbars>
                    <Stack gap="sm">
                        {lowStockProducts.map((product) => (
                            <Group
                                key={product.id.S}
                                justify="space-between"
                                wrap="nowrap"
                                pr="xs"
                            >
                                <div>
                                    <Text fw={500} size="sm">
                                        {product.name.S}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {product.category.S}
                                    </Text>
                                </div>

                                <Badge color="orange" variant="light">
                                    {product.quantity.N} left
                                </Badge>
                            </Group>
                        ))}
                    </Stack>
                </ScrollArea>
            )}
        </Card>
    );
}

