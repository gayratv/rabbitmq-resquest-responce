import { RMQ_serverQuery } from './rmq-request-responce/lib/server.js';
import { RMQ_clientQuery } from './rmq-request-responce/lib/clients.js';

const srv = new RMQ_serverQuery();
await srv.createRMQ_serverQuery();

const cli = new RMQ_clientQuery();
await cli.createRMQ_clientQuery();

await cli.sendProxyRequest();
await cli.sendProxyRequest();
