// сообщение запроса proxy
import { ConsumeMessage } from 'amqplib';
import { RMQ_serverQuery } from './server.js';

export interface MSGproxyEnquiry {
  responseQueueName: string;
  internalID?: number;
  leasePeriod?: number; // время аренды
}

export interface ProxyResponce {
  proxy: string;
  internalID?: number; // тот же самый номер который поступил при запросе
}

export type Worker = (this: RMQ_serverQuery, msg: ConsumeMessage) => Promise<void>;
