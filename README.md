docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

Realize request/response pattern

There are many clients sending requests to a single worker.

There is a queue (RabbitMQ) in front of the handler. Requests from clients are placed in the queue. A separate response queue is created for each client (by client itself), the name of the queue is contained in the client's request

On initialization, client creates a temporary queue which is deleted when client closes the connection to RMQ with these parameters:
{
    queue: true,
    autoDelete: true,
}

The worker, after processing the request, places the response into the queue created by the client

