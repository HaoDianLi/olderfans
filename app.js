import express from 'express';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import configRoutes from './routes/index.js';

const app = express();

// set handlebars as the template engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars'); // set view engine to handlebars

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + '/public');

app.use('/public', staticDir);

// middleware and route configs

// updates currentYear in main 
app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});