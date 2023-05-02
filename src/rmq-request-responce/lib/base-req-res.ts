import amqplib, { Channel, Connection } from 'amqplib';
import { rmqConfig } from '../../config/config-rmq.js';
import { NLog } from 'tslog-fork';
import { RmqConnection } from './rmq-connection.js';

/*
 * порядок использования
 * const a=new RMQ_construct_queues(....);
 * await a.createRMQ_construct_queues()
 */
export class RMQ_construct_queues {
  public log = NLog.getInstance();
  public connection: Connection;
  public channel: Channel;

  constructor(public exchange: string, public queueInputName: string, public routingKey: string) {}

  /*
   * инициализирует exchange типа direct
   * а такеже очередь queueInputName
   */
  async createRMQ_construct_queues() {
    const rcon = await RmqConnection.getInstance();
    this.connection = rcon.connection;
    this.channel = rcon.channel;

    await rcon.channel.assertExchange(this.exchange, 'direct', { durable: false });

    // подключится к  que для запроса работы
    await rcon.channel.assertQueue(this.queueInputName, { durable: false });
    await rcon.channel.bindQueue(this.queueInputName, this.exchange, this.routingKey);
  }

  async closeConnections() {
    await RmqConnection.closeRMQconnection();
    this.connection = null;
    this.channel = null;
  }
}
