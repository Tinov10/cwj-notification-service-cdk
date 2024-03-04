import { SQSEvent } from 'aws-lambda';
import { plainToClass } from 'class-transformer';
import { EmailInput } from '../dtos/email.dto';
import { AppValidationError } from '../utility/errors';

// /* SES */
import { SendEmailUsingSES } from '../providers/email';

/* Sendgrid */
// import { ORDER_CONFIRMATION, SendEmail } from '../providers/email';

export const EmailHandler = async (event: SQSEvent) => {
  const response: Record<string, unknown>[] = [];

  console.log('Email Handler');

  const promisses = event.Records.map(async (record: any) => {
    const input = plainToClass(EmailInput, JSON.parse(record.body));
    const errors = await AppValidationError(input);

    console.log('ERRORS: ', JSON.stringify(errors));

    /* SENDGRID */
    // if (!errors) {
    //   const { to, name, order_number } = input;

    //   const OrderTemplate = ORDER_CONFIRMATION({
    //     email: to,
    //     firstName: name,
    //     orderNumber: order_number,
    //   });

    //   await SendEmail(OrderTemplate);
    // } else {
    //   response.push({ error: JSON.stringify(errors) });
    // }

    /* SES */
    if (!errors) {
      const { to, name, order_number } = input;

      const emailBody = `Dear Mr. ${name} thank you for doing business with us. Here is your order number for future references: ${order_number}, sent from @AWS SES.`;

      await SendEmailUsingSES({ to, message: emailBody });
    } else {
      response.push({ error: JSON.stringify(errors) });
    }

    await Promise.all(promisses);

    console.log('SQS response:', response);

    return { response };
  });
};
