const rp = require('request-promise');
const cheerio = require('cheerio');
var {mongoose} = require('../db/mongoose');
var {QuoteModel, QuoteData} = require('../models/quote');


var Scrapper = function (category, page_no , callback) {
    const options = {
        uri: `https://www.goodreads.com/quotes/tag/${category}?page=${page_no}`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    var quotes = [];
    var result = [];
    rp(options)
        .then(($, cb) => {
            $('.quoteText').each(function() {
                // quotes.push($(this).text().trim().split("<br />")[0].replace(/^\s+|\s+$/g, ' '));
                quotes.push($(this).contents().text().replace(/^\s+|\s+$/g, ' ').replace(/\s+/g,' '));
            });
            quotes.forEach((data) => {
                quotesData = new QuoteData();
                let quote = data.split('―')[0];
                let author = data.split('―')[1];
                quotesData.quote = quote;
                quotesData.author = author;
                quotesData.category = category;
                result.push(quotesData);
            });
            callback(result);

        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {Scrapper};
