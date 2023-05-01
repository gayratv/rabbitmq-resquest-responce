/*
In the `amqplib` library for Node.js, you can filter messages that are delivered to a consumer by setting the `options` parameter in the `channel.consume()` method. The `options` parameter is an object that can include various properties, including the `arguments` property, which can be used to specify filters for the messages.

    To filter messages based on their properties, you can use the `arguments` property to set a filter expression using the RabbitMQ's "x-match" syntax. The `arguments` property is an object where each key is a header key to match against, and each value is an object containing the value to match and the matching criteria. For example, to match messages where the `"type"` header is `"important"`, you can set the `arguments` property as follows:
*/

import amqplib from 'amqplib';

async function consumeFilteredMessages() {
  const conn = await amqplib.connect('amqp://localhost');
  const channel = await conn.createChannel();
  const queueName = 'my-queue';

  await channel.assertQueue(queueName);

  // Set up a filter to match messages where the "type" header is "important"
  const filter = {
    type: { match: 'all', value: 'important' },
  };

  const options2 = {
    noAck: true,
    arguments: {
      'x-match': 'all',
      type: 'myMessageType',
      headers: {
        myHeader: 'myHeaderValue',
      },
    },
  };
  channel.consume(
    queueName,
    (msg) => {
      console.log('Received message:', msg.content.toString());
    },
    options2,
  );

  await channel.consume(
    queueName,
    (msg) => {
      console.log('Received message:', msg.content.toString());
    },
    { arguments: filter },
  );
}

consumeFilteredMessages().catch(console.error);

/*

In this example, the `filter` object specifies a filter expression that matches messages where the `"type"` header is `"important"`. The `arguments` property is set to `filter` in the `channel.consume()` method to apply the filter to the messages.

    You can also use other matching criteria besides `"match": "all"`, such as `"match": "any"` or `"match": "none"`, to control how the filter matches the header values. You can also use multiple key-value pairs in the `filter` object to match against multiple headers in the message.*/
