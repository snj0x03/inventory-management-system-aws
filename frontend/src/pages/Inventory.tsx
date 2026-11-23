import { Modal, Button, Paper, Group, Table, Title, TextInput, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { API_URL } from '../config/env';


const Inventory = () => {

    const [opened, { open, close }] = useDisclosure(false);
    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
    });

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/inventory`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                const result = await response.json();
                setProducts(result.data);
            } catch (error) {
                console.error(error);
            }
        };
        getProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(`${API_URL}/inventory/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!result.success) {
                console.log("unable to add data");
            } else {
                console.log("imtem addded");
                setProducts((prev) => [...prev, {
                    name: { S: formData.name },
                    category: { S: formData.category },
                    price: { N: formData.price },
                    quantity: { N: formData.quantity },
                }]);
                close();
            }
        } catch {
            console.log("error");
        }
    }

    const rows = products.map((product) => {
        return (
            <Table.Tr>
                <Table.Td>{product.name.S}</Table.Td>
                <Table.Td>{product.category.S}</Table.Td>
                <Table.Td>{product.price.N}</Table.Td>
                <Table.Td>{product.quantity.N}</Table.Td>
            </Table.Tr>
        );
    });



    const handleChange = (e) => {
        const { name, value } = e.currentTarget;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <Stack>
            <Group justify="space-between">

                <Title order={2}>Inventory</Title>

                <Modal opened={opened} onClose={close} title="Add Product" centered>
                    <form onSubmit={handleSubmit}>
                        <TextInput label="Name" name="name" value={formData.name} onChange={handleChange} mt="md" />
                        <TextInput label="Category" name="category" value={formData.category} onChange={handleChange} mt="md"/>
                        <TextInput label="Price" name="price" value={formData.price} onChange={handleChange} mt="md" />
                        <TextInput label="Quantity" name="quantity" value={formData.quantity} onChange={handleChange} mt="md" />
                        <Group justify="flex-end" mt="xl">
                        <Button variant="default" onClick={close}>
                                Cancel
                            </Button>
                        <Button type="submit">Add Product</Button>
                        </Group>
                    </form>
                </Modal>

                <Button variant="default" onClick={open}>
                    Add Product 
                </Button>
            </Group>

            <Paper withBorder radius="md" p="md" shadow="sm">
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="xs">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Category</Table.Th>
                            <Table.Th>Price</Table.Th>
                            <Table.Th>Quantity</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            </Paper>
        </Stack>
    );
}


export default Inventory;
