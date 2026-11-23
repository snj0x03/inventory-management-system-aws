import { type AttributeValue, ScanCommand, type ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { docClient } from "../database/db";
import type { Request, Response } from "express";

// Types 

interface TotalResponse {
    data?: number;
}

interface ProductsResponse {
    data?: Record<string, AttributeValue>[]
}


// Total Revenue 

const getTotalRevenue = async (
    req: Request, 
    res: Response<TotalResponse | { message: string }>
): Promise<void> => {
    try {
        let totalRevenue: number = 0;

        const command: ScanCommand = new ScanCommand({
            TableName: "Order",
            ProjectionExpression: "#tp",
            ExpressionAttributeNames: {
                "#tp": "totalPrice",
            },
        });
        const result: ScanCommandOutput = await docClient.send(command);

        // console.log("Result of Total Revenue");
        // console.log(result);

        const items: Record<string, AttributeValue>[] = result.Items ?? [];
        for(let index = 0; index < items.length; index++) {
            totalRevenue += Number(items[index].totalPrice.N)
        }

        res.status(200).json({
            data: totalRevenue,
        })
    } catch {
        res.status(500).json({
            message: "Server Error",
        });

    }
}


// Total Stock Count

const getTotalStockCount = async (
    req: Request, 
    res: Response<TotalResponse | { message: string }>
): Promise<void> => {
    try {
        let totalStockCount: number = 0;
        let lastEvaluatedKey: Record<string, AttributeValue> | undefined;
        do {
            const command: ScanCommand = new ScanCommand({
                TableName: "Inventory",
                ProjectionExpression: "#q",
                ExpressionAttributeNames: {
                    "#q": "quantity",
                },
                ExclusiveStartKey: lastEvaluatedKey,
            });
            const result: ScanCommandOutput = await docClient.send(command);

            // console.log("Result of Total Stock Count");
            // console.log(result);

            totalStockCount += (result.Items ?? []).reduce((sum, item) => {
                return sum + Number(item.quantity.N);
            }, 0);

            lastEvaluatedKey = result.LastEvaluatedKey;
        } while(lastEvaluatedKey);

        res.status(200).json({
            data: totalStockCount,
        })
    } catch {
        res.status(500).json({
            message: "Server Error",
        });
    }
}


// Total Product Count

const getTotalProductCount = async (
    req: Request, 
    res: Response<TotalResponse | { message: string }>
): Promise<void> => {
    try{
        let totalProductCount: number = 0;
        let lastEvaluatedKey: Record<string, AttributeValue> | undefined;

        do {
            const command: ScanCommand = new ScanCommand({
                TableName: "Inventory",
                Select: "COUNT",
                ExclusiveStartKey: lastEvaluatedKey,
            });
            const result: ScanCommandOutput = await docClient.send(command);

            // console.log("Result of Total Product Count");
            // console.log(result);

            totalProductCount += result.Count ?? 0;

            lastEvaluatedKey = result.LastEvaluatedKey;
        } while(lastEvaluatedKey);


        res.status(200).json({
            data: totalProductCount,
        })

    } catch {
        res.status(500).json({
            message: "Server Error"
        });
    }
}


// Low Stock Items

const getLowStockProducts = async (
    req: Request, 
    res: Response<ProductsResponse | { message: string }>
): Promise<void> => {
    try{
        let lowStockProducts: Record<string, AttributeValue>[] = [];
        let lastEvaluatedKey: Record<string, AttributeValue> | undefined;

        do {
            const command: ScanCommand = new ScanCommand({
                    TableName: "Inventory",
                    FilterExpression: "#q BETWEEN :min AND :max",
                    ExpressionAttributeNames: {
                        "#q": "quantity",
                    },
                    ExpressionAttributeValues: {
                        ":min": { N: "1" },
                        ":max": { N: "4" },
                    },
                    ExclusiveStartKey: lastEvaluatedKey,
            });
            const result: ScanCommandOutput = await docClient.send(command);

            // console.log("Result of Low Stock Items");
            // console.log(result);

            lowStockProducts.push(...(result.Items ?? []))

            lastEvaluatedKey = result.LastEvaluatedKey;
        } while(lastEvaluatedKey);

        res.status(200).json({
            data: lowStockProducts,
        })

    } catch {
        res.status(500).json({
            message: "Server Error",
        });
    }
}


// Out of Stock Items

const getZeroStockProducts = async (
    req: Request, 
    res: Response<ProductsResponse | { message: string }>
): Promise<void> => {
    try{
        let zeroStockProducts: Record<string, AttributeValue>[] = [];
        let lastEvaluatedKey: Record<string, AttributeValue> | undefined;

        do {
            const command: ScanCommand = new ScanCommand({
                    TableName: "Inventory",
                    FilterExpression: "#q = :zero",
                    ExpressionAttributeNames: {
                        "#q": "quantity",
                    },
                    ExpressionAttributeValues: {
                        ":zero": { N: "0" },
                    },
                    ExclusiveStartKey: lastEvaluatedKey,
            });
            const result: ScanCommandOutput = await docClient.send(command);

            // console.log("Result of Zero Stock Items");
            // console.log(result);

            zeroStockProducts.push(...(result.Items ?? []))

            lastEvaluatedKey = result.LastEvaluatedKey;
        } while(lastEvaluatedKey);


        res.status(200).json({
            data: zeroStockProducts,
        })

    } catch {
        res.status(500).json({
            message: "Server Error",
        });
    }
}


// Exports

export {
    getTotalProductCount,
    getTotalStockCount,
    getTotalRevenue,
    getLowStockProducts,
    getZeroStockProducts,
};
