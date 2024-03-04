import twilio from 'twilio';

const accountSid = 'ACa20a5f9acaXXXXXXXXXXXXXXXXXXX';
const authToken = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

const client = twilio(accountSid, authToken);

export const SendVerificationCode = async (
  code: number,
  toPhoneNumber: string
) => {
  const response = await client.messages.create({
    body: `Your verification code is ${code} it will expire within 30 minutes.`,
    from: '+18138963397',
    to: toPhoneNumber.trim(),
  });
  console.log(response);
  return response;
};
