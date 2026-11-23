import RevenueCard from "../components/RevenueCard";
import ProductsCard from "../components/ProductsCard"
import TotalStockCard from "../components/StockCard"
import LowStockCard from "../components/LowStockCard"
import ZeroStockCard from "../components/ZeroStockCard"
import { Grid, Container } from "@mantine/core";


const Dashboard = () => {
    return (
        <Container my="md">
            <Grid>
                <Grid.Col span={{ base: 12, xs: 4 }}>
                    <RevenueCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 4 }}>
                    <ProductsCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 4 }}>
                    <TotalStockCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6 }}>
                    <LowStockCard />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6 }}>
                    <ZeroStockCard />
                </Grid.Col>
            </Grid>
        </Container>
    );
}


export default Dashboard;
