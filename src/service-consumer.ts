import amqp from 'amqplib';

let channel: amqp.Channel, connection: amqp.Connection; //global variables

async function connectQueue() {
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();

    // connect to 'test-queue', create one if doesnot exist already
    await channel.assertQueue('test-queue');

    channel.consume('test-queue', (data) => {
      // console.log(data)
      console.log('Data received : ', `${Buffer.from(data.content)}`);
      channel.ack(data);
    });
  } catch (error) {
    console.log(error);
  }
}

connectQueue(); // call connectQueue function
