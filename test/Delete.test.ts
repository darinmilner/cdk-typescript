import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../services/SpacesTable/Delete";

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: "0f461d58-9274-4b49-a4b4-7ba29b53bc08",
  },
} as any;
const result = handler(event, {} as any).then((apiResult) => {
  const items = JSON.parse(apiResult.body);
  console.log(items);
});
