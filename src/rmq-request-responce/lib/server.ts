import { ConsumeMessage } from 'amqplib';
import { proxyRMQnames } from '../../config/config-rmq.js';
import { RMQ_construct_queues } from './base-req-res.js';
import { MSGproxyEnquiry, ProxyResponce } from './types.js';
import { delay } from '../../helpers/common.js';

/*
 * принимает запрос по queue и отправляет ответ в очередь, указанную в msg
 */
export class RMQ_serverQuery extends RMQ_construct_queues {
  private proxyInternal = 0;

  constructor() {
    const { exchange, queueInputName, routingKey } = proxyRMQnames;
    super(exchange, queueInputName, routingKey);
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

    const payload: MSGproxyEnquiry = JSON.parse(msg.content.toString());
    this.log.debug(' server recieve query', payload.internalID);

    const response: ProxyResponce = { proxy: this.proxyInternal.toString(), internalID: payload.internalID };
    this.proxyInternal++;

    await delay(1_000);
    this.channel.sendToQueue(payload.responseQueueName, Buffer.from(JSON.stringify(response)));

    this.log.debug(' server response proxy', response.proxy);
    await this.channel.ack(msg);
  };
}
