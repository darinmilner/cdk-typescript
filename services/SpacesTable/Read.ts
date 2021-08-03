import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const PRIMARYKEY = process.env.PRIMARYKEY;
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
    if (event.queryStringParameters) {
      if (PRIMARYKEY! in event.queryStringParameters) {
        result.body = await queryWIthPrimaryPartition(
          event.queryStringParameters
        );
      } else {
        result.body = await queryWIthSecondaryPartition(
          event.queryStringParameters
        );
      }
    } else {
      result.body = await scanTable();
    }
  } catch (error) {
    result.body = error.message;
  }

  return result;
}

async function queryWIthSecondaryPartition(
  queryParams: APIGatewayProxyEventQueryStringParameters
) {
  const queryKey = Object.keys(queryParams)[0];
  const queryValue = queryParams[queryKey];

  const queryResponse = await dbClient
    .query({
      TableName: TABLENAME!,
      IndexName: queryKey,
      KeyConditionExpression: "#zz = :zzzz",
      ExpressionAttributeNames: {
        "#zz": queryKey!,
      },
      ExpressionAttributeValues: {
        ":zzzz": queryValue,
      },
    })
    .promise();

  return JSON.stringify(queryResponse.Items);
}

async function queryWIthPrimaryPartition(
  queryParams: APIGatewayProxyEventQueryStringParameters
) {
  const keyValue = queryParams[PRIMARYKEY!];
  const queryResponse = await dbClient
    .query({
      TableName: TABLENAME!,
      KeyConditionExpression: "#zz = :zzzz",
      ExpressionAttributeNames: {
        "#zz": PRIMARYKEY!,
      },
      ExpressionAttributeValues: {
        ":zzzz": keyValue,
      },
    })
    .promise();
  return JSON.stringify(queryResponse);
}
async function scanTable() {
  const queryResponse = await dbClient
    .scan({
      TableName: TABLENAME!,
    })
    .promise();
  return JSON.stringify(queryResponse.Items);
}

export { handler };
