import { useState } from "react";
import { Button, TextInput, PasswordInput, Container, Title, Paper } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/env";


const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });


            const data = await response.json();

            if (response.status) {
                await login(data.user, data.token);
                navigate("/");
            }

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container size={420} my={40}>
            <Title ta="center">
                Registeration
            </Title>
            <Paper w={340} withBorder shadow="sm" p="xl" mt={40} radius="md">
                <form onSubmit={handleSubmit}>
                    <TextInput
                        withAsterisk
                        label="Email"
                        placeholder="your@email.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <PasswordInput
                        withAsterisk
                        label="password"
                        placeholder="your@email.com"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        fullWidth mt="xl"
                        radius="md"
                        type="submit"
                        loading={loading}
                    >
                        Register 
                    </Button>
                </form>
            </Paper>
        </Container>
    )

}


export default Register;
