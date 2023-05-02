import { MSGproxyEnquiry } from '../lib/types.js';
import { RMQ_clientQueryBase } from '../lib/base-clients.js';

export class RMQ_proxyClientQuery extends RMQ_clientQueryBase {
  private constructor(exchange: string, queueInputName: string, routingKey: string) {
    super(exchange, queueInputName, routingKey);
  }

  /*
   * единственный метод получения класса
   */
  static async createRMQ_clientQuery(exchange: string, queueInputName: string, routingKey: string) {
    const cli = new RMQ_proxyClientQuery(exchange, queueInputName, routingKey);
    await cli.createRMQ_clientQueryBase();

    return cli;
  }

  // послать сообщение обработчику0
  async sendProxyRequest() {
    const msg: MSGproxyEnquiry = { internalID: this.internalID++, responseQueueName: this.responceQueueName };
    this.channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(msg)));
  }
}
