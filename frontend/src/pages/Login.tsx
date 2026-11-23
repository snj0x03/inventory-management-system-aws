import { useState } from "react";
import { Button, TextInput, Anchor, PasswordInput, Container, Title, Text, Paper } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/env";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    console.log(API_URL);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);


        try {
            const response = await fetch(`${API_URL}/auth/login`, {
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
                throw new Error("Login failed");
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
            <Title ta="center" >
                Welcome back!
            </Title>
            <Text >
                Do not have an account yet? <Anchor><Link to={"/register"}>Create account</Link></Anchor>
            </Text>
            <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
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
                        Sign in
                    </Button>
                </form>
            </Paper>
        </Container>
    )

}


export default Login;
