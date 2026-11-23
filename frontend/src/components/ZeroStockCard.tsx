import {
    Card,
    Text,
    Group,
    Stack,
    Divider,
    ScrollArea
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { API_URL } from '../config/env';


export default function ZeroStockCard() {
    const [zeroStockProducts, setZeroStockProducts] = useState([]);

    useEffect(() => {
        const getLowStock = async () => {
            try {
                const response = await fetch(`${API_URL}/dashboard/zeroStock`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                const result = await response.json();
                setZeroStockProducts(result.data);
            } catch (error) {
                console.error(error);
            }
        };
        getLowStock();
    }, []);

    return (
        <Card withBorder shadow="sm" radius="md" padding="lg">
            <Group justify="space-between" mb="md">
                <Group gap="xs">
                    <IconAlertCircle color="red" size={22} />
                    <Text fw={700} size="lg">
                       Out of Stock 
                    </Text>
                </Group>

            </Group>

            <Divider mb="sm" />

            {zeroStockProducts.length === 0 ? (
                <Text c="dimmed" ta="center" py="lg">
                    No zero stock products.
                </Text>
            ) : (
                <ScrollArea h={250}>
                    <Stack gap="sm">
                        {zeroStockProducts.map((product) => (
                            <Group
                                key={product.id.S}
                                justify="space-between"
                                wrap="nowrap"
                            >
                                <div>
                                    <Text fw={500} size="sm">
                                        {product.name.S}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {product.category.S}
                                    </Text>
                                </div>
                            </Group>
                        ))}
                    </Stack>
                </ScrollArea>
            )}
        </Card>
    );
}
