/*
Suppose you have a messaging system that handles orders for a pizza restaurant. There are different types of orders, such as "delivery", "pickup", and "catering", and you want to ensure that each type of order is handled by the appropriate component.

One way to achieve this is to use message filtering, where each component subscribes to only the message types or topics that it is interested in. For example, the "delivery" component could subscribe to messages with a "delivery" topic, while the "pickup" component could subscribe to messages with a "pickup" topic. The "catering" component could subscribe to messages with a "catering" topic.

Here's an example of how this could be implemented using RabbitMQ and the amqplib library for Node.js:
 */

import amqplib from 'amqplib';

async function startDeliveryService() {
  const connection = await amqplib.connect({ heartbeat: 60 });
  const channel = await connection.createChannel();

  // Subscribe to messages with "delivery" topic
  await channel.assertExchange('orders', 'topic', { durable: false });
  const deliveryQueue = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(deliveryQueue.queue, 'orders', 'delivery.*');

  // Handle messages with "delivery" topic
  channel.consume(deliveryQueue.queue, (msg) => {
    console.log(`Received delivery order: ${msg.content.toString()}`);
    // process delivery order
    channel.ack(msg);
  });
}

async function startPickupService() {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();

  // Subscribe to messages with "pickup" topic
  await channel.assertExchange('orders', 'topic', { durable: false });
  const pickupQueue = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(pickupQueue.queue, 'orders', 'pickup.*');

  // Handle messages with "pickup" topic
  channel.consume(pickupQueue.queue, (msg) => {
    console.log(`Received pickup order: ${msg.content.toString()}`);
    // process pickup order
    channel.ack(msg);
  });
}

async function startCateringService() {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();

  // Subscribe to messages with "catering" topic
  await channel.assertExchange('orders', 'topic', { durable: false });
  const cateringQueue = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(cateringQueue.queue, 'orders', 'catering.*');

  // Handle messages with "catering" topic
  channel.consume(cateringQueue.queue, (msg) => {
    console.log(`Received catering order: ${msg.content.toString()}`);
    // process catering order
    channel.ack(msg);
  });
}

async function publishDeliveryOrder() {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();

  // Publish message with "delivery" topic
  const message = 'A new delivery order';
  const routingKey = 'delivery.new';
  await channel.assertExchange('orders', 'topic', { durable: false });
  console.log('channel.publish ', channel.publish('orders', 'delivery.new', Buffer.from(message)));

  // await channel.close();
  // await connection.close();
}

// Start each service in separate processes
startDeliveryService();
startPickupService();
startCateringService();

// Generate a new delivery order
publishDeliveryOrder();
