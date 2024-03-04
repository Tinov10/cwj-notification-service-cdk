/* SES */
import * as AWS from 'aws-sdk';

export const SendEmailUsingSES = async ({
  to,
  message,
}: {
  to: string;
  message: string;
}) => {
  var params = {
    Destination: {
      CcAddresses: ['xxxxx@gmail.com'],
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: message,
        },
        Text: {
          Charset: 'UTF-8',
          Data: message,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Test email',
      },
    },
    Source: 'xxxxx@gmail.com',
    ReplyToAddresses: ['xxxxx@gmail.com'],
  };

  const sesService = new AWS.SES({ apiVersion: '2010-12-01' });

  await sesService.sendEmail(params).promise();
};

/* Sendgrid */
import sendgrid from '@sendgrid/mail';

const SENDGRID_API_KEY = 'SG_xxxxxx';
const FROM_EMAIL = 'support@xxx.com';
const TEMP_ORDER_CONFIRMATION = '';

sendgrid.setApiKey(SENDGRID_API_KEY);

export interface EmailTemplate {
  to: string;
  from: string;
  templateId: string;
  dynamic_template_data: Record<string, unknown>;
}

export const ORDER_CONFIRMATION = ({
  email,
  firstName,
  orderNumber,
}: {
  email: string;
  firstName: string;
  orderNumber: string;
}): EmailTemplate => {
  return {
    to: email,
    from: FROM_EMAIL,
    templateId: TEMP_ORDER_CONFIRMATION,
    dynamic_template_data: {
      name: firstName,
      order_number: orderNumber,
    },
  };
};

export const SendEmail = async (template: EmailTemplate) => {
  try {
    await sendgrid.send(template);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
