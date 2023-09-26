import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exphbs from 'express-handlebars';
import fansRouter from './routes/fans.js';
import postsRouter from './routes/posts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', fansRouter);
app.use('/', postsRouter);

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// updates currentYear in main 
app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  next();
});

app.get('/', (req, res) => {
  res.render('homepage');
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});