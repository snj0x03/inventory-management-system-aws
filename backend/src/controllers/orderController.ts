import { ScanCommand, type TransactWriteCommandOutput } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../database/db";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { type ScanCommandOutput } from "@aws-sdk/client-dynamodb";


// Types 

interface AddOrderRequestBody {
    productId: string;
    quantity: number;
    name: string;
    userId: string;
    price: number;
}

interface GetOrderResponse {
    success: boolean;
    data: Record<string, any>[]
}

interface AddOrderResponse {
    success: boolean;
    message: string;
}

interface ErrorResponse {
    success: boolean;
    message: string;
}


// Get User Orders 

const getUserOrders = async (
    req: Request,
    res: Response<GetOrderResponse | ErrorResponse>
): Promise<void> => {
    try {
        const userId = req.params.userId as string | undefined;

        const command: ScanCommand = new ScanCommand({
            TableName: "Order",
            FilterExpression: "userId = :uid",
            ExpressionAttributeValues: {
                ":uid": userId,
            },
        })
        const result: ScanCommandOutput = await docClient.send(command);

        // console.log("Result of User Orders");
        // console.log(result);

        res.status(200).json({
            success: true,
            data: result.Items || [],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Cannot Get Order",
        });
    }
};


// Create New Order 

const addOrder = async (
    req: Request<{}, AddOrderResponse | ErrorResponse, AddOrderRequestBody>,
    res: Response<AddOrderResponse | ErrorResponse>
): Promise<void> => {
    try {
        const { userId, productId, quantity, name, price } = req.body;

        const command: TransactWriteCommand = new TransactWriteCommand({
            TransactItems: [
                {
                    Update: {
                        TableName: "Inventory",
                        Key: {
                            id: productId
                        },
                        UpdateExpression:
                            "SET quantity = quantity - :quantity",
                        ConditionExpression:
                            "quantity >= :quantity",
                        ExpressionAttributeValues: {
                            ":quantity": quantity
                        }
                    }
                },
                {
                    Put: {
                        TableName: "Order",
                        Item: {
                            id: randomUUID(),
                            userId: userId,
                            productId: productId,
                            name: name,
                            quantity: quantity,
                            totalPrice: price * quantity,
                            orderedDate: new Date().toISOString()
                        }
                    }
                }
            ]
        });
        const result: TransactWriteCommandOutput = await docClient.send(command);

        // console.log("Result of Add Order");
        // console.log(result);

        if (result.$metadata.httpStatusCode != 200) {
            res.status(401).json({
                success: false,
                message: "Cannot Place Order",
            });
        }

        res.status(201).json({
            success: true,
            message: "Order Placed Successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export { getUserOrders, addOrder };
