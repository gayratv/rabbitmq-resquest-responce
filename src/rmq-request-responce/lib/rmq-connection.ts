import amqplib, { Channel, Connection } from 'amqplib';
import { rmqConfig } from '../../config/config-rmq.js';
import { delay } from '../../helpers/common.js';
import { NLog } from 'tslog-fork';

/*
 returns singleton contains RMQ connection and chanel
 RMQ describe that need only one connection and one chanel for one thread
 because node is 1 thread app we need only one chanel
 */

export class RmqConnection {
  public connection: Connection;
  public channel: Channel;

  private static instance: RmqConnection;

  private constructor() {}

  /*
   * инициализирует connection + chanel
   */
  private static async RmqConnection() {
    const rmqConnection = new RmqConnection();

    // const rcq = new RMQ_construct_queues(exchange, queueInputName, routingKey);
    rmqConnection.connection = await amqplib.connect(rmqConfig);
    rmqConnection.channel = await rmqConnection.connection.createChannel();

    return rmqConnection;
  }

  static async getInstance() {
    if (!RmqConnection.instance) {
      RmqConnection.instance = await RmqConnection.RmqConnection();
    }
    return RmqConnection.instance;
  }

  static async closeRMQconnection() {
    const rmq = RmqConnection.instance;
    if (!rmq || !rmq.channel || !rmq.connection) return;
    await delay(500);
    await rmq.channel.close();
    await rmq.connection.close();
    RmqConnection.instance = null;
    rmq.connection = null;
    rmq.channel = null;
    const log = NLog.getInstance();
    log.info('Channel and connection closed');
  }
}
