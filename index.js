// index.js (backend root)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 4000;

// Allow local dev & production frontend origins
const allowedOrigins = [
  'http://localhost:5173',               // Vite dev server default (adjust if yours is different)
  'https://nilakkal-parking.vercel.app'  // your deployed frontend domain (replace if different)
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like curl, postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
if (apiRouter) app.use('/api', apiRouter);

app.get('/', (req, res) => res.send('Backend OK'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
