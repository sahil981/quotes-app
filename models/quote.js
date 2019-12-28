  
const mongoose = require('mongoose');

var QuoteModel = mongoose.model('QuoteModel',{
    quote:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    author: {
        type: String,
        minlength: 1,
        trim: true
       
    },
    category:{
        type: String,
        minlength: 1,
        trim: true
    }
});

var QuoteData = function () {
    return {quote: '', author: '', category: ''}
};


module.exports = {QuoteModel,QuoteData};
