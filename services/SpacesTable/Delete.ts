import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const TABLENAME = process.env.TABLENAME as string;
const PRIMARYKEY = process.env.PRIMARYKEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello from DyanmoDB",
  };

  try {
    const spaceId = event.queryStringParameters?.[PRIMARYKEY];

    if (spaceId) {
      const deleteResult = await dbClient
        .delete({
          TableName: TABLENAME,
          Key: {
            [PRIMARYKEY]: spaceId,
          },
        })
        .promise();
      result.body = JSON.stringify(deleteResult);
    }
  } catch (error) {
    result.body = error.message;
  }
  return result;
}

export { handler };
