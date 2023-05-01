import { ConsumeMessage } from 'amqplib';
import { proxyRMQnames, rmqConfig } from './config-rmq.js';
import { v4 as uuidv4 } from 'uuid';
import { RMQ_construct_queues } from './base-req-res.js';
import { MSGproxyInquery, ProxyResponce } from './types.js';
import { SimpleLog } from 'tslog-fork';
import { namedLog } from './helpers.js';

/*
 * принимает запрос по queue и отправляет ответ в очередь, указанную в msg
 */
export class RMQ_serverQuery extends RMQ_construct_queues {
  private proxyInternal = 0;

  constructor() {
    const { exchange, queueInputName, routingKey } = proxyRMQnames;
    super(exchange, queueInputName, routingKey);
    this.log = namedLog('server');
  }

  /*
   * вызвать сразу после New
   */
  async createRMQ_serverQuery() {
    await this.createRMQ_construct_queues();
    await this.consumeRequest();
  }

  private async consumeRequest() {
    await this.channel.consume(this.queueInputName, this.handelRequest, { noAck: false });
  }

  private handelRequest = async (msg: ConsumeMessage) => {
    this.log.debug(msg.fields);
    this.log.debug(msg.content.toString());

    const payload: MSGproxyInquery = JSON.parse(msg.content.toString());
    const responce: ProxyResponce = { proxy: this.proxyInternal.toString(), internalID: payload.internalID };

    this.channel.sendToQueue(payload.responceQueueName, Buffer.from(JSON.stringify(responce)));

    this.log.debug('======== server handelRequest end');
    await this.channel.ack(msg);
  };
}
