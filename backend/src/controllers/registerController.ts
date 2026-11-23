import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "node:crypto";
import { docClient } from "../database/db";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

// Types

interface RegisterRequestBody {
    email: string;
    password: string;
}

interface RegisterResponse {
    message: string;
    token: string;
    user: {
        id: string;
        email: string;
        role: "customer";
    };
}

interface ErrorResponse {
    message: string;
}


// Register 

const register = async (
    req: Request<{}, RegisterResponse | ErrorResponse, RegisterRequestBody>,
    res: Response<RegisterResponse | ErrorResponse>) => {
    try {
        const {email, password} = req.body;

        // Check Existence of Email 
        const queryCommand = new ScanCommand({
            TableName: "User",
            FilterExpression: "#email = :email",
            ExpressionAttributeNames: {
                "#email": "email",
            },
            ExpressionAttributeValues: {
                ":email": { S: email },
            },
        });
        const queryResult = await docClient.send(queryCommand);

        if(queryResult.Items && queryResult.Items.length > 0) {
            res.status(409).json({
                message: "Email Already Registered"
            })
            return;
        }

        // Create User 
        const id = randomUUID();
        const command = new PutCommand({
            TableName: "User",
            Item: {
                id: id , 
                email: email, 
                password: password,
                role: "customer", 
            }
        })
        const result = await docClient.send(command);

        // Check Creation of User
        if(result.$metadata.httpStatusCode != 200) {
            res.status(401).json({ message: "Unable to Create User" });
            return;
        }

        // Create Token
        const token = jwt.sign(
            { id: id, role: "customer" },
            String(process.env.JWT_SECRET), 
            { expiresIn: "1h"}
        );

        res.status(201).json({
            message: "User Created",
            token: token,
            user: {
                id: id,
                email: email,
                role: "customer"
            }
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};


// Exports

export { register };

