import { Card, Text, Group, ThemeIcon } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconChartBar } from '@tabler/icons-react';
import { API_URL } from '../config/env';


export default function RevenueCard() {
    const [totalStockCount, setTotalStockCount] = useState(0);

    useEffect(() => {
        const getRevenue = async () => {
            try {
                const response = await fetch(`${API_URL}/dashboard/totalStock`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                
                const result = await response.json();
                setTotalStockCount(result.data);
            } catch (error) {
                console.error(error);
            }
        };

        getRevenue();
    }, []);

    return (
        <Card withBorder shadow="sm" radius="md" padding="lg">
            <Group justify="space-between">
                <div>
                    <Text c="dimmed" size="xs" fw={700} tt="uppercase">
                        Total Stock 
                    </Text>

                    <Text fw={700} size="xl" mt="xs">
                        {Number(totalStockCount).toLocaleString('en-US')}
                    </Text>
                </div>

                <ThemeIcon
                    color="green"
                    variant="light"
                    size={48}
                    radius="md"
                >
                    <IconChartBar size={28} />
                </ThemeIcon>
            </Group>
        </Card>
    );
}

