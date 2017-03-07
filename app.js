/*jslint unparam: true, node: true */

/* --------------------------------------------------------------------------
   Module Dependencies & Configuration
-------------------------------------------------------------------------- */

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var path = require('path');
var builder = require('./book/builder.js');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* --------------------------------------------------------------------------
   Routing & Error Handling
-------------------------------------------------------------------------- */

app.get('/book/builder/:quantity', function (request, response) {
    var quantity = request.params.quantity,
        limit = builder.limit;
    if (isNaN(quantity)) {
        response.send(400, { error: 'Specified parameter must be a number.' });
    } else if (quantity < 1 || quantity > builder.limit) {
        response.send(400, { error: 'Specified parameter exceeds limit (1-' + builder.limit + ').' });
    } else {
       response.json(builder.create(quantity));
    }
});

// Uncomment only after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// HTTP 404 forwards to error handler
app.use(function(request, response, next) {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Development
if (app.get('env') === 'development') {
    app.use(function(error, request, response) {
        response.status(error.status || 500);
        response.json( { message: error.message, error: error } );
    });
}

// Production
app.use(function(error, request, response) {
    response.status(error.status || 500);
    response.json( { message: error.message, error: {} } );
});

module.exports = app;