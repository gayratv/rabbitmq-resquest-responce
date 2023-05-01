import { ConsumeMessage } from 'amqplib';
import { proxyRMQnames, rmqConfig } from './config-rmq.js';
import { v4 as uuidv4 } from 'uuid';
import { RMQ_construct_queues } from './base-req-res.js';
import { MSGproxyInquery, ProxyResponce } from './types.js';

/*
 * принимает запрос по queue и отправляет ответ в очередь, указанную в msg
 */
export class RMQ_serverQuery extends RMQ_construct_queues {
  private proxyInternal = 0;

  constructor() {
    const { exchange, queueInputName, routingKey } = proxyRMQnames;
    super(exchange, queueInputName, routingKey);
  }

  async createRMQ_clientQuery() {
    this.createRMQ_construct_queues();
  }

  private async consumeRequest() {
    await this.channel.consume(this.queueInputName, this.handelRequest, { noAck: false });
  }

  private handelRequest = async (msg: ConsumeMessage) => {
    console.log(msg.fields);
    console.log(msg.content.toString());

    const payload: MSGproxyInquery = JSON.parse(msg.content.toString());
    const responce: ProxyResponce = { proxy: this.proxyInternal.toString(), internalID: payload.internalID };

    this.channel.sendToQueue(payload.responceQueueName, Buffer.from(JSON.stringify(responce)));

    console.log('======== server handelRequest end');
    await this.channel.ack(msg);
  };
}
