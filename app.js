import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';

import configRoutes from './routes/index.js';

const app = express();

// Set Handlebars as the template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Other middleware and route configurations

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});