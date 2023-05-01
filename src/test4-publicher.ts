import amqplib from 'amqplib';
import { ConsumeMessage, Options } from 'amqplib/properties.js';

async function main() {
  // по умолчанию все параметры заданы на 'amqp://localhost:5672'
  const connection = await amqplib.connect({
    heartbeat: 60,
    // hostname: 'localhost',
  });

  const channel = await connection.createChannel();
  try {
    console.log('Publishing');
    const exchange = 'user.signed_up';
    await channel.assertExchange(exchange, 'direct', { durable: false });

    // ==========
    const queue1 = 'user.sign_up_email';
    const routingKey1 = 'sign_up_email';

    await channel.assertQueue(queue1, { durable: false });
    await channel.bindQueue(queue1, exchange, routingKey1);

    // ==========
    const queue2 = 'user.logout';
    const routingKey2 = 'logout';

    await channel.assertQueue(queue2, { durable: false });
    await channel.bindQueue(queue2, exchange, routingKey2);

    const msg1 = { id: Math.floor(Math.random() * 1000), email: 'user@domail.com', name: 'firstname lastname' };
    const msg2 = { id: Math.floor(Math.random() * 1000), email: 'logout' };
    /*
    expiration: A string value that specifies the message's expiration time, in milliseconds. After the expiration time has elapsed, the message will be automatically deleted by RabbitMQ. This is useful for preventing stale messages from accumulating in the system.
     */
    // await channel.publish(exchange, routingKey1, Buffer.from(JSON.stringify(msg)), { expiration: 10_000 });
    const esendRes = await channel.publish(exchange, routingKey1, Buffer.from(JSON.stringify(msg1)));
    const esendRes2 = await channel.publish(exchange, routingKey2, Buffer.from(JSON.stringify(msg2)));

    // const qsendRes = await channel.sendToQueue(queue1, Buffer.from(JSON.stringify(msg2)));
    // console.log(`esendRes ${esendRes}  qsendRes ${qsendRes}`);

    console.log('Message published');
  } catch (e) {
    console.error('Error in publishing message', e);
  } finally {
    console.info('Closing channel and connection if available');
    channel && (await channel.close());
    await connection.close();
    console.info('Channel and connection closed');
  }
}

async function processMessage(msg: ConsumeMessage) {
  console.log('======== processMessage Start');
  /*
  content: Buffer;
    consumerTag - identifying the consumer for which the message is destined
     deliveryTag: number; - deliveryTag, a serial number for the message
    redelivered: boolean;
    exchange: string;
    routingKey: string;
   */
  // console.log(msg);
  /*
   fields: {
    consumerTag: 'email_consumer',
    deliveryTag: 1,
    redelivered: false,
    exchange: 'user.signed_up',
    routingKey: 'sign_up_email'
  },

   */
  console.log(msg.fields);
  console.log(msg.content.toString());
  console.log('======== processMessage end');
}

async function consumer() {
  const connection = await amqplib.connect({});
  const channel = await connection.createChannel();
  const chanelClose = false;
  /*  channel.once('close', () => {
    console.log('>>>>>>>>>>> chanel closed');
    chanelClose = true;
  });*/

  // await channel.prefetch(10);

  const queue1 = 'user.sign_up_email';
  await channel.assertQueue(queue1, { durable: false });

  // ==========
  const queue2 = 'user.logout';
  await channel.assertQueue(queue2, { durable: false });

  try {
    /*
    The server reply contains one field, consumerTag. It is necessary to remember this somewhere if you will later want to cancel this consume operation (i.e., to stop getting messages).
     */
    const consumeReply1 = await channel.consume(
      queue1,
      async (msg) => {
        await processMessage(msg);
        await channel.ack(msg);
      },
      {
        noAck: false, // не посылать автоматическое подтверждение
        consumerTag: 'email_consumer',
      },
    );
    console.log('consumeReply : ', consumeReply1);

    const consumeReply2 = await channel.consume(
      queue2,
      async (msg) => {
        await processMessage(msg);
        await channel.ack(msg);
      },
      {
        noAck: false, // не посылать автоматическое подтверждение
        consumerTag: 'logout_consumer',
      },
    );
    console.log('consumeReply : ', consumeReply2);
  } finally {
  }

  /* setTimeout(async () => {
    await channel.close();
    await connection.close();
    console.info('Channel and connection closed');
  }, 500);*/
}

await main();
await consumer();
await main();
// process.exit(0);
