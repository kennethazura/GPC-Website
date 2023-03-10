import express from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const server = express();
const port = process.env.SERVER_PORT;
server.set('view engine', 'ejs');
server.use('/dist', express.static(path.join(__dirname, 'dist')));

if (process.env.ENVIRONMENT === 'local') {
  server.use('/assets', express.static(path.join(__dirname, 'assets')));
}

server.get(process.env.API_ROUTE + '/job-categories', (req, res) => {
  const sJobCategoriesDataURL = process.env.DOMAIN + process.env.ASSET_LINK + '/data/job-categories.json';

  fetch(sJobCategoriesDataURL, { method: 'Get' })
    .then((oResponse) => oResponse.json())
    .then((oJobCategories) => {
      const aJobCategories = oJobCategories.jobCategories;
      const iStart = (req.query.start) ? parseInt(req.query.start, 10) : 0;
      const iCount = (req.query.count) ? iStart + parseInt(req.query.count, 10) : iStart + 3;
      return res.send(aJobCategories.slice(iStart, iCount));
    });
});

server.get('/', (req, res) => {
  fetch(process.env.DOMAIN + process.env.API_ROUTE + '/job-categories?count=6')
    .then(async(oResponse) => {
      const aJobCategories = await oResponse.json();
      res.render('home.ejs', { jobCategories: aJobCategories, assetLink: process.env.ASSET_LINK });
    });
});

server.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
