import { Card, Text, Group, ThemeIcon } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconPackage } from '@tabler/icons-react';
import { API_URL } from '../config/env';


export default function ProductsCountCard() {
    const [totalProductCount, setTotalProductCount] = useState("");

    useEffect(() => {
        const getTotalProductCount = async () => {
            try {
                const response = await fetch(`${API_URL}/dashboard/totalProducts`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                const result = await response.json();
                setTotalProductCount(result.data);
            } catch (error) {
                console.error(error);
            }
        };
        getTotalProductCount();
    }, []);

    return (
        <Card withBorder shadow="sm" radius="md" padding="lg">
            <Group justify="space-between">
                <div>
                    <Text c="dimmed" size="xs" fw={700} tt="uppercase">
                        Total Products 
                    </Text>

                    <Text fw={700} size="xl" mt="xs">
                        {Number(totalProductCount).toLocaleString('en-US')}
                    </Text>
                </div>

                <ThemeIcon
                    color="green"
                    variant="light"
                    size={48}
                    radius="md"
                >
                    <IconPackage size={28} />
                </ThemeIcon>
            </Group>
        </Card>
    );
}

