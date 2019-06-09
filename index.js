const rp = require('request-promise');
const cheerio = require('cheerio');
const express = require('express')

const app = express();

const options = {
    uri: `https://www.goodreads.com/quotes/tag/inspiration?page=2`,
    transform: function (body) {
      return cheerio.load(body);
    }
  };


  app.get('/', function (req, res) {
    var quotes = [];
    var quoteData = { 'quote' : '' , 'author' : '', 'category' : 'love'};
    var result = [];

    rp(options)
        .then(($, cb) => {
             $('.quoteText').each(function() {
                // quotes.push($(this).text().trim().split("<br />")[0].replace(/^\s+|\s+$/g, ' '));
                quotes.push($(this).contents().text().replace(/^\s+|\s+$/g, ' ').replace(/\s+/g,' '));
            });
            console.log(quotes.length);
            quotes.forEach((data) => {
                quoteData = { 'quote' : '' , 'author' : ''};
                let quote = data.split('―')[0];
                let author = data.split('―')[1];
                quoteData.quote = quote;
                quoteData.author = author;
                quoteData.category = 'love';
                result.push(quoteData);
            });

            res.send((result));
        })
        .catch((err) => {
        console.log(err);
        }); 

     

  });




app.listen(3000);







