import express from 'express';

const app = express();
const PORT = 3010;

app.get('/', (req, res) => {
  res.end('Hello world');
});

app.listen(PORT, () => console.log('Server running at port ' + PORT));
