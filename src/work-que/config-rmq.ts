import { Options } from 'amqplib';

export const rmqConfig: Options.Connect = {
  hostname: 'localhost',
  port: 5672,
  heartbeat: 60,
};

export const proxyRMQnames = {
  exchange: 'proxy.exchange',
  queueInputName: 'proxy.queue.input',
  routingKey: 'proxy.getproxy',
};
