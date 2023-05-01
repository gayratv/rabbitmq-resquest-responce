import express from 'express';
import amqp from 'amqplib';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

let channel: amqp.Channel, connection: amqp.Connection; //global variables

async function connectQueue() {
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();

    // connect to 'test-queue', create one if doesnot exist already
    await channel.assertQueue('test-queue');
  } catch (error) {
    console.log(error);
  }
}

const sendData = async (data: NonNullable<unknown>) => {
  // send data to queue
  await channel.sendToQueue('test-queue', Buffer.from(JSON.stringify(data)));

  // close the channel and connection
  await channel.close();
  await connection.close();
};

app.get('/send-msg', (req, res) => {
  const data = {
    title: 'Six of Crows',
    author: 'Leigh Burdugo',
  };

  sendData(data);

  console.log('A message is sent to queue');
  res.send('Message Sent');
});

connectQueue(); // call connectQueue function

app.listen(PORT, () => console.log('Server running at port ' + PORT));
