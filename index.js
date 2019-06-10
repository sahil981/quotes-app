const rp = require('request-promise');
const cheerio = require('cheerio');
const express = require('express')
var {mongoose} = require('./db/mongoose');
var bodyParser = require('body-parser');
var {QuoteModel} = require('./models/quote');

const app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
  
  let category = req.query.category;
  let page_no = req.query.page

  const options = {
    uri: `https://www.goodreads.com/quotes/tag/${category}?page=${page_no}`,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
    var quotes = [];
    var quoteData = { 'quote' : '' , 'author' : '', 'category' : category};
    var result = [];

    rp(options)
        .then(($, cb) => {
             $('.quoteText').each(function() {
                // quotes.push($(this).text().trim().split("<br />")[0].replace(/^\s+|\s+$/g, ' '));
                quotes.push($(this).contents().text().replace(/^\s+|\s+$/g, ' ').replace(/\s+/g,' '));
            });
            console.log(quotes.length);
            quotes.forEach((data) => {
                let quote = data.split('―')[0];
                let author = data.split('―')[1];
                quoteData = { 'quote' : '' , 'author' : ''};

                var quoteModel = new QuoteModel({
                  quote : quote,
                  author : author,
                  category : category
                });

                quoteModel.save().then((doc)=>{
                  console.log('success');
                }, (err)=>{
                    res.status(400).send(err);
                });
              
                quoteData.quote = quote;
                quoteData.author = author;
                quoteData.category = category;
                result.push(quoteData);
            });
              
            res.send((result));
        })
        .catch((err) => {
        console.log(err);
        }); 

     

  });

  app.get('/quotes', (req,res)=>{
    QuoteModel.find().then((quote)=>{
        res.send({
            quote
        });
    }, (err)=>{
        res.status(400).send(err);
    });
});




app.listen(3000);







