// соообщение запроса proxy
export interface MSGproxyInquery {
  responceQueueName: string;
  internalID?: number;
  leasePeriod?: number; // время аренды
}

export interface ProxyResponce {
  proxy: string;
  internalID?: number; // тот же самый номер который поступил при запросе
}
