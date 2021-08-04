import { DynamoDB } from "aws-sdk";
import { generateRandomId, getEventBody } from "../Shared/Utils";
import {
  MissingFieldError,
  validateSpaceEntry,
} from "../Shared/InputValidator";
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

  try {
    const item = getEventBody(event);

    item.spaceId = generateRandomId();
    validateSpaceEntry(item);

    await dbClient
      .put({
        TableName: TABLENAME!,
        Item: item,
      })
      .promise();

    result.body = JSON.stringify(`Created item with ID ${item.spaceId}`);
  } catch (error) {
    if (error instanceof MissingFieldError) {
      result.statusCode = 403;
    } else {
      result.statusCode = 500;
    }

    result.body = error.message;
  }

  return result;
}

export { handler };
