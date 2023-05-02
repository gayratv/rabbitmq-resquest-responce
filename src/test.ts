import { RMQ_serverQuery } from './rmq-request-responce/lib/server.js';
import { RMQ_proxyClientQuery } from './rmq-request-responce/clients/clients.js';
import { proxyRMQnames } from './config/config-rmq.js';
import { workerGetProxy } from './rmq-request-responce/workers/worker-get-proxy.js';

async function main() {
  const { exchange, queueInputName, routingKey } = proxyRMQnames;

  const srv = await RMQ_serverQuery.createRMQ_serverQuery(exchange, queueInputName, routingKey, workerGetProxy);

  const cli = await RMQ_proxyClientQuery.createRMQ_clientQuery(exchange, queueInputName, routingKey);

  await cli.sendProxyRequest();
  // await cli.sendProxyRequest();
  console.log('******** FINISH');
}

await main();
