import { ConsumeMessage } from 'amqplib';
import { proxyRMQnames } from '../../config/config-rmq.js';
import { v4 as uuidv4 } from 'uuid';
import { RMQ_construct_queues } from './base-req-res.js';
import { MSGproxyEnquiry } from './types.js';

export class RMQ_clientQuery extends RMQ_construct_queues {
  protected internalID = 0;

  constructor() {
    const { exchange, queueInputName, routingKey } = proxyRMQnames;
    super(exchange, queueInputName, routingKey);
  }

  async createRMQ_clientQuery() {
    await this.createRMQ_construct_queues();

    await this.initPrivateQueueForResponses();

    await this.consumeResponse();
  }

  // послать сообщение обработчику0
  async sendProxyRequest() {
    const msg: MSGproxyEnquiry = { internalID: this.internalID++, responseQueueName: this.responceQueueName };
    this.channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(msg)));
  }

  // инициализировать очередь для ответов от сервера
  private async initPrivateQueueForResponses() {
    this.responceQueueName = `proxy-${uuidv4()}`;
    await this.channel.assertQueue(this.responceQueueName, {
      exclusive: true,
      autoDelete: true,
    });
  }

  // responseQueueName - поступают ответы от сервера
  private async consumeResponse() {
    await this.channel.consume(this.responceQueueName, this.handleResponse, { noAck: false });
  }

  private handleResponse = async (msg: ConsumeMessage) => {
    this.log.debug(msg.fields);
    this.log.debug(msg.content.toString());
    this.log.debug('======== handleResponse end');
    await this.channel.ack(msg);
  };
}
