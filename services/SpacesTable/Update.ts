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

  const reqBody =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);

  const spaceId = event.queryStringParameters?.[PRIMARYKEY];

  if (reqBody && spaceId) {
    const reqBodyKey = Object.keys(reqBody)[0];
    const reqBodyValue = reqBody[reqBodyKey];

    const updateResult = await dbClient
      .update({
        TableName: TABLENAME,
        Key: {
          [PRIMARYKEY]: spaceId,
        },

        UpdateExpression: "set #zzzNew = :new",
        ExpressionAttributeValues: {
          ":new": reqBodyValue,
        },
        ExpressionAttributeNames: {
          "#zzzNew": reqBodyKey,
        },
        ReturnValues: "UPDATED_NEW",
      })
      .promise();

    result.body = JSON.stringify(updateResult);
  }
  return result;
}

export { handler };
