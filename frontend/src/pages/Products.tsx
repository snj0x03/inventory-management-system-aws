import { Modal, Button, Group, Table, Paper, TextInput, NumberInput, Title, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/env';


const Products = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();


    const handleOrderClick = (product) => {
        if (product.quantity.N === "0") {
            alert("Out of Stock!");
            return;
        }
        setSelectedProduct(product);
        setQuantity(1);
        open();
    };


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
                console.log(result);
                setProducts(result.data);
            } catch (error) {
                console.error(error);
            }
        };
        getProducts();
    }, [refresh]);


    const rows = products.map((product) => (
        <Table.Tr key={product.id.S}>
            <Table.Td>{product.name.S}</Table.Td>
            <Table.Td>{product.category.S}</Table.Td>
            <Table.Td>{product.price.N}</Table.Td>
            <Table.Td>{product.quantity.N}</Table.Td>
            <Table.Td ta="center">
                <Button onClick={() => handleOrderClick(product)}>
                    Order
                </Button>
            </Table.Td>
        </Table.Tr>
    ));


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/order/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                credentials: "include",
                body: JSON.stringify({
                    userId: user.id,
                    productId: selectedProduct.id.S,
                    price: selectedProduct.price.N,
                    quantity: quantity,
                    name: selectedProduct.name.S,
                    category: selectedProduct.category.S,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Order failed");
            }
            setSelectedProduct(null);
            setRefresh((prev) => prev + 1);
            close();
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Stack>
        <Title order={2}>Products</Title>
            <Modal
                opened={opened}
                onClose={close}
                title="Place Order"
                centered
            >
                {selectedProduct && (
                    <form onSubmit={handleSubmit}>
                        <TextInput
                            label="Product"
                            value={selectedProduct.name.S}
                            readOnly
                        />

                        <TextInput
                            label="Price"
                            value={selectedProduct.price.N}
                            readOnly
                            mt="md"
                        />

                        <NumberInput
                            label="Quantity"
                            name="quantity"
                            min={1}
                            max={Number(selectedProduct.quantity.N)}
                            value={quantity}
                            onChange={(v) => setQuantity(Number(v))}
                            mt="md"
                        />

                        <Group justify="flex-end" mt="xl">
                            <Button variant="default" onClick={close}>
                                Cancel
                            </Button>

                            <Button type="submit">
                                Confirm Order
                            </Button>
                        </Group>
                    </form>
                )}
            </Modal>

            <Paper withBorder radius="md" p="md" shadow="sm">
                <Table.ScrollContainer minWidth={800}>
                    <Table verticalSpacing="xs">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Category</Table.Th>
                                <Table.Th>Price</Table.Th>
                                <Table.Th>Quantity</Table.Th>
                                <Table.Th ta="center">Action</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Paper>
        </Stack>
    );
}


export default Products;
