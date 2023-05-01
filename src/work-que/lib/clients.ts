import { ConsumeMessage } from 'amqplib';
import { proxyRMQnames, rmqConfig } from './config-rmq.js';
import { v4 as uuidv4 } from 'uuid';
import { RMQ_construct_queues } from './base-req-res.js';
import { MSGproxyInquery } from './types.js';
import { namedLog } from './helpers.js';

export class RMQ_clientQuery extends RMQ_construct_queues {
  protected internalID = 0;

  constructor() {
    const { exchange, queueInputName, routingKey } = proxyRMQnames;
    super(exchange, queueInputName, routingKey);
    this.log = namedLog('client');
  }

  async createRMQ_clientQuery() {
    await this.createRMQ_construct_queues();

    await this.initPrivateQueueForResponces();

    await this.consumeResponce();
  }

  // послать сообщение обработчику0
  async sendProxyRequest() {
    const msg: MSGproxyInquery = { internalID: this.internalID++, responceQueueName: this.responceQueueName };
    const esendRes = await this.channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(msg)));
  }

  // инициализировать очередь для ответов от сервера
  private async initPrivateQueueForResponces() {
    this.responceQueueName = `proxy-${uuidv4()}`;
    await this.channel.assertQueue(this.responceQueueName, {
      exclusive: true,
      autoDelete: true,
    });
  }

  // responceQueueName - поступают ответы от сервера
  private async consumeResponce() {
    await this.channel.consume(this.responceQueueName, this.handelResponce, { noAck: false });
  }

  private handelResponce = async (msg: ConsumeMessage) => {
    this.log.debug(msg.fields);
    this.log.debug(msg.content.toString());
    this.log.debug('======== handelResponce end');
    await this.channel.ack(msg);
  };
}
