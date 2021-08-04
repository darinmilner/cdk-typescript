import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../services/SpacesTable/Create";

const event: APIGatewayProxyEvent = {
  body: {
    name: "Kuala Lumpur",
    location: "The capital of Malaysia. A very diverse city.",
  },
} as any;
const result = handler(event, {} as any).then((apiResult) => {
  const items = JSON.parse(apiResult.body);
  console.log(items);
});
