import 'reflect-metadata';
import { Construct } from 'constructs';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';

import { join } from 'path';

import { ServiceInterface } from './service-interface';

export class ServiceConstruct extends Construct {
  //
  public readonly services: ServiceInterface;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const functionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(120),
    };

    this.services = {
      emailHandler: this.createHandlers(functionProps, 'EmailHandler'),
      otpHandler: this.createHandlers(functionProps, 'OTPHandler'),
    };
  }

  createHandlers(props: NodejsFunctionProps, handler: string): NodejsFunction {
    return new NodejsFunction(this, handler, {
      entry: join(__dirname, '/../src/handlers/index.ts'),
      handler,
      ...props,
    });
  }
}

/*

- create multiple lambdas with a class and function
- create topic 
- export topic Arn
- import topic (Transaction Service)  TODO
- create SQS


*/
