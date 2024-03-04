import { SQSEvent } from 'aws-lambda';
import { plainToClass } from 'class-transformer';

import { SMSInput } from '../dtos/sms.dto';
import { AppValidationError } from '../utility/errors';
import { SendVerificationCode } from '../providers/sms';

export const OTPHandler = async (event: SQSEvent) => {
  const response: Record<string, unknown>[] = [];

  const promisses = event.Records.map(async (record: any) => {
    // input
    const input = plainToClass(SMSInput, JSON.parse(record.body)); // we do need to parse because we won't use Middy and X

    // errors
    const errors = await AppValidationError(input);

    console.log('ERRORS: ', JSON.stringify(errors));

    if (!errors) {
      const { phone, code } = input;
      await SendVerificationCode(Number(code), phone.trim()); // we receive strings
    } else {
      response.push({ error: JSON.stringify(errors) });
    }
  });

  await Promise.all(promisses);

  console.log('SQS response', response);

  return { response }; // response only contains errors
};
