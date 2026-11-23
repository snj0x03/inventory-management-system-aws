import jwt from "jsonwebtoken";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../database/db";
import { type ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import type { Request, Response } from "express";

// Types 

interface LoginReqestBody {
    email: string,
    password: string,
}

interface User {
    id: string;
    email: string;
    password: string;
    role: "admin" | "customer";
}

interface LoginResponse {
    message: string;
    token: string;
    user: {
        id: string;
        email: string;
        role: User["role"];
    }
}

interface ErrorResponse {
    message: string;
}


// Login

const login = async (
    req: Request<{}, LoginResponse | ErrorResponse, LoginReqestBody>,
    res: Response<LoginResponse | ErrorResponse>
): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Get User
        const command = new ScanCommand({
            TableName: "User",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
               ":email": email,
            }
            
        });
        const result: ScanCommandOutput = await docClient.send(command);
        const user = result.Items?.[0] as User | undefined;

        // Check User Existence
        if(!user) {
            res.status(401).json({
                message: "Invalid Email or Password",
            });
            return;
        }

        // Check Validity of Password
        const isPasswordValid = (password === user.password);
        if(!isPasswordValid) {
            res.status(401).json({
                message: "Invalid Password",
            });
            return;
        }

        // Check validity of Token
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            String(process.env.JWT_SECRET), 
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login Successful",
            token: token, 
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};


// Exports 

export { login };

