import { type AttributeValue, PutItemCommand, type PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { docClient } from "../database/db";
import { randomUUID } from "node:crypto";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import type { Request, Response } from "express";


// Types

interface CreateProductRequestBody {
    name: string;
    category: string;
    price: number;
    quantity: number;
}

interface CreateProductResponse {
    success: boolean;
    message: string;
}

interface GetProductsResponse {
    success: boolean;
    data: Record<string, AttributeValue>[];
}

interface ErrorResponse {
    success: boolean;
    message: string;
}


// Create Product

const createProduct = async (
    req: Request<{}, CreateProductResponse | ErrorResponse, CreateProductRequestBody>,
    res: Response<CreateProductResponse | ErrorResponse>
): Promise<void> => {
    try {
        const { name, category, price, quantity } = req.body;

        console.log(req.body);


        const command: PutItemCommand = new PutItemCommand({
            TableName: "Inventory",
            Item: {
                id: { S: randomUUID() },
                name: { S: name },
                category: { S: category },
                price: { N: String(price) },
                quantity: { N: String(quantity) }
            }
        });

        const result: PutItemCommandOutput = await docClient.send(command);

        // console.log("Result of Create Product");
        // console.log(result);

        if (result.$metadata.httpStatusCode != 200) {
            res.status(401).json({
                success: false,
                message: "Cannot Create Product",
            });
            return;
        }

        res.status(201).json({
            success: true,
            message: "Product Created"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        })
    }
};

const getProducts = async (
    req: Request,
    res: Response<GetProductsResponse | ErrorResponse>
): Promise<void> => {
    try {
        const products: Record<string, AttributeValue>[] = [];
        let lastEvaluatedKey: Record<string, AttributeValue> | undefined;
        do {
            const command: ScanCommand = new ScanCommand({
                TableName: "Inventory",
                ExclusiveStartKey: lastEvaluatedKey,
            });
            const result = await docClient.send(command);

            products.push(...(result.Items ?? []));

            lastEvaluatedKey = result.LastEvaluatedKey;
        } while (lastEvaluatedKey);

        // console.log("Result of Get Products");
        // console.log(products)

        res.status(200).json({
            success: true,
            data: products,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        })
    }
};


// Exports

export {
    createProduct,
    getProducts
}

