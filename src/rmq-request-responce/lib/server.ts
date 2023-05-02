import { RMQ_construct_queues } from './base-req-res.js';
import { Worker } from './types.js';

/*
 * принимает запрос по queue и отправляет ответ в очередь, указанную в msg
 */
export class RMQ_serverQuery extends RMQ_construct_queues {
  private constructor(exchange: string, queueInputName: string, routingKey: string) {
    super(exchange, queueInputName, routingKey);
  }

  /*
   * для каждого обработчика необходимо создать свою очередь, которую он будет прослушивать и брать оттуда задания
   */
  static async createRMQ_serverQuery(exchange: string, queueInputName: string, routingKey: string, worker: Worker) {
    const rserver = new RMQ_serverQuery(exchange, queueInputName, routingKey);
    await rserver.createRMQ_construct_queues();
    await rserver.consumeRequest(worker);

    return rserver;
  }

  private async consumeRequest(worker: Worker) {
    const workerBind = worker.bind(this);
    // клиенты будут получать по одному сообщению за один раз
    await this.channel.prefetch(1, false); // Per consumer limit

    await this.channel.consume(this.queueInputName, workerBind, { noAck: false });
  }
}
