import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/lib/aws-lambda";
import { join } from "path";

import { LambdaIntegration, RestApi } from "aws-cdk-lib/lib/aws-apigateway";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/lib/aws-lambda-nodejs";

export class SpaceStack extends Stack {
  //can reference in other classes
  private api = new RestApi(this, "SpaceApi");
  private spacesTable = new GenericTable("SpacesTable", "SpaceId", this);

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const helloLambdaNodeJs = new NodejsFunction(this, "nodeJSLambda", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });

    //Hello API lambda
    const helloLamdbaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const helloLambdaResource = this.api.root.addResource("hello");

    helloLambdaResource.addMethod("GET", helloLamdbaIntegration);
  }
}
