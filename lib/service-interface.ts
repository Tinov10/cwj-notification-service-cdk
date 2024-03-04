import { IFunction } from 'aws-cdk-lib/aws-lambda';

export interface ServiceInterface {
  readonly emailHandler: IFunction;
  readonly otpHandler: IFunction;
}
