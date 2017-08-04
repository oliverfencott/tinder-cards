const app = require('express')();
const cors = require('cors');
const PORT = 3000;
const potentialMatches = require('./potentialMatches');
const HOST = 'localhost';

app.use(cors());

app.get('/api/potential-matches', (request, response) => {
  response.json(potentialMatches());
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});
