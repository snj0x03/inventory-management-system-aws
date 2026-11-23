import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: String(process.env.REGION),
});

export const docClient = DynamoDBDocumentClient.from(client);
