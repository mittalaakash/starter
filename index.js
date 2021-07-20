const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

///////////////// FILES
//blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about avocado ${textIn}.\n Created on ${Date.now()}`;
// fs.writeFileSync('./txt/Output.txt', textOut);
// console.log('file written');

//non-blocking, asynchronous way
// fs.readFile('./txt/start3434.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('Error! 💥💥');
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, err => {
//         console.log('Your file has been written');
//       });
//     });
//   });
// });
// console.log('reading file');

//////////// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8',
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8',
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8',
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugify = require('./node_modules/slugify');
const slugs = dataObj.map(el =>
  slugify(el.productName, {
    lower: true,
    replacement: '+', // it will default to '_'
  }),
);
// console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  }
  //PRODUCT PAGE
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  //API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'content-type': 'application/json',
    }),
      res.end(data);
  }
  //PAGE NOT FOUND
  else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'Hello-World',
    });
    res.end('<h1><i>Page not Found</i></h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000');
});
