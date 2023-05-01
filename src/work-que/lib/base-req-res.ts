import amqplib, { Channel, Connection } from 'amqplib';
import { ConsumeMessage } from 'amqplib';
import { rmqConfig } from './config-rmq.js';
import { SimpleLog } from 'tslog-fork';

export class RMQ_construct_queues {
  protected connection: Connection;
  protected channel: Channel;
  protected responceQueueName: string;
  public log: SimpleLog;

  constructor(public exchange: string, public queueInputName: string, public routingKey: string) {}

  /*
   * инициализирует exchange типа direct
   * а такеже очередь queueInputName
   */
  async createRMQ_construct_queues() {
    // const rcq = new RMQ_construct_queues(exchange, queueInputName, routingKey);
    this.connection = await amqplib.connect(rmqConfig);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(this.exchange, 'direct', { durable: false });

    // подлкючится к  que для запроса работы
    await this.channel.assertQueue(this.queueInputName, { durable: false });
    await this.channel.bindQueue(this.queueInputName, this.exchange, this.routingKey);
  }
}
