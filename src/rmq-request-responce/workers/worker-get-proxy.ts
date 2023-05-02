import { ConsumeMessage } from 'amqplib';
import { MSGproxyEnquiry, ProxyResponce } from '../lib/types.js';
import { delay } from '../../helpers/common.js';
import { RMQ_serverQuery } from '../lib/server.js';
import { RmqConnection } from '../lib/rmq-connection.js';
import { NLog } from 'tslog-fork';

let proxyInternal = 100;

export async function workerGetProxy(this: RMQ_serverQuery, msg: ConsumeMessage) {
  const rcon = await RmqConnection.getInstance();
  const log = NLog.getInstance();

  // log.debug(msg.fields);
  /*
  { consumerTag: 'amq.ctag-Y56MHQSgejHXJZ32md5qyw',
  deliveryTag: 2,
  redelivered: false,
  exchange: 'proxy.exchange',
  routingKey: 'proxy.getproxy' }

   */

  // {"internalID":0,"responseQueueName":"proxy-86fc51b0-8a2c-4c1f-bf45-feacb93e779e"}

  const payload: MSGproxyEnquiry = JSON.parse(msg.content.toString());
  log.debug('Получил задание ', msg.content.toString(), ' server recieve query ', payload.internalID);

  const response: ProxyResponce = { proxy: proxyInternal.toString(), internalID: payload.internalID };
  proxyInternal++;

  await delay(1_000);
  rcon.channel.sendToQueue(payload.responseQueueName, Buffer.from(JSON.stringify(response)));

  log.debug(' server response proxy', response.proxy);
  await rcon.channel.ack(msg);
}
