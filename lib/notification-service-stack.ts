import { Stack, CfnOutput, Duration, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ServiceConstruct } from './service-construct';

import { Topic, SubscriptionFilter } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';

import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export class NotificationServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1
    //
    // create SNS topic
    // the other MS publish to this topic
    const topic = new Topic(this, 'NotificationTopic'); // aws-cdk-lib/aws-sns

    // create email SQS
    const emailQueue = new Queue(this, 'EmailQueue', {
      visibilityTimeout: Duration.seconds(120), // instead of timeout --> visibilityTimeout also 120
    });

    // subscribe SQS to SNS
    // we publish to SNS
    this.addSubscription(topic, emailQueue, ['customer_email']);

    // 2
    //
    // create otp SQS
    const otpQueue = new Queue(this, 'OTPQueue', {
      visibilityTimeout: Duration.seconds(120),
    });

    // subscribe SQS to SNS
    this.addSubscription(topic, otpQueue, ['customer_otp']);

    //
    //
    //
    //

    const { services } = new ServiceConstruct(this, 'NotificationService');

    // 3
    //
    // create event source for sending Email
    // pass in queue
    const sqsEmailEventSource = new SqsEventSource(emailQueue);

    // create event source for sending SMS
    // pass in queue
    const sqsOTPEventSource = new SqsEventSource(otpQueue);

    // create Lambda triggers

    // create lambda trigger email
    // services.emailHandler.addEventSource(new SqsEventSource(emailQueue));
    services.emailHandler.addEventSource(sqsEmailEventSource);

    // create lambda trigger otp
    // services.otpHandler.addEventSource(new SqsEventSource(otpQueue));
    services.otpHandler.addEventSource(sqsOTPEventSource);

    // only when using SES give lambda permission to send emails with SES
    services.emailHandler.addToRolePolicy(
      new PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
        effect: Effect.ALLOW,
      })
    );

    // 3
    //
    // export SNS topic
    new CfnOutput(this, 'NotificationTopic', {
      value: topic.topicArn,
      exportName: 'notificationServiceArn',
    });
  }

  //
  addSubscription(topic: Topic, queue: Queue, allowlist: string[]) {
    topic.addSubscription(
      new SqsSubscription(queue, {
        rawMessageDelivery: true,
        filterPolicy: {
          actionType: SubscriptionFilter.stringFilter({ allowlist }),
        },
      })
    );
  }

  //
}
