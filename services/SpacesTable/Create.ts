import { DynamoDB } from "aws-sdk";
import { v4 } from "uuid";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const TABLENAME = process.env.TABLENAME;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello from DyanmoDB",
  };

  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);

  item.spaceId = v4();

  try {
    await dbClient
      .put({
        TableName: TABLENAME!,
        Item: item,
      })
      .promise();
  } catch (error) {
    result.body = error.message;
  }
  result.body = JSON.stringify(`Created item with ID ${item.spaceId}`);

  return result;
}

export { handler };
