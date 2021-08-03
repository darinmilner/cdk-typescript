import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../services/SpacesTable/Read";

const event1 = {
  body: {
    location: "Mecca",
  },
};
const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: "85916c03-fdce-4ba5-a43c-4c778a6ea36a",
  },
} as any;
const result = handler(event, {} as any).then((apiResult) => {
  const items = JSON.parse(apiResult.body);
  console.log(items);
});
