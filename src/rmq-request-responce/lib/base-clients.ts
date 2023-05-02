import { ConsumeMessage } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { RMQ_construct_queues } from './base-req-res.js';

export class RMQ_clientQueryBase extends RMQ_construct_queues {
  protected internalID = 0;
  public responceQueueName: string; // для каждого клиента создается уникальная очередь

  constructor(exchange: string, queueInputName: string, routingKey: string) {
    super(exchange, queueInputName, routingKey);
  }

  /*
   * вызвать после new
   */
  async createRMQ_clientQueryBase() {
    await this.createRMQ_construct_queues();
    await this.initPrivateQueueForResponses();
    await this.consumeResponse();
  }

  // инициализировать очередь для ответов от сервера
  private async initPrivateQueueForResponses() {
    this.responceQueueName = `proxy-${uuidv4()}`;
    await this.channel.assertQueue(this.responceQueueName, {
      exclusive: true,
      autoDelete: true,
    });
  }

  // responseQueueName - в эту очередь поступают ответы от сервера
  private async consumeResponse() {
    await this.channel.consume(this.responceQueueName, this.handleResponse, { noAck: false });
  }

  // от сервера поступили ответы на запросы - надо с ними как то поступить
  private handleResponse = async (msg: ConsumeMessage) => {
    this.log.debug(msg.fields);
    this.log.debug(msg.content.toString());
    this.log.debug('======== handleResponse end');
    await this.channel.ack(msg);
  };
}
