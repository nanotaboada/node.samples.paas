/*jslint unparam: true, node: true */

/* --------------------------------------------------------------------------
   Module Dependencies & Configuration
-------------------------------------------------------------------------- */

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var express = require('express');
var path = require('path');
var builder = require('./book/builder.js');
var pg = require('pg');
pg.defaults.ssl = true;
// heroku pg:pull DATABASE_URL heroku-local --app node-samples-paas
var connectionString = process.env.DATABASE_URL || 'postgres:///heroku-local';
var client = new pg.Client(connectionString);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

/* --------------------------------------------------------------------------
   Routing & Error Handling
-------------------------------------------------------------------------- */

app.get('/book/builder/:quantity', function(request, response) {
    var quantity = request.params.quantity,
        limit = builder.limit;
    if (isNaN(quantity)) {
        response.status(400).send({ error: 'Specified parameter must be a number.' });
    } else if (quantity < 1 || quantity > builder.limit) {
        response.status(400).send({ error: 'Specified parameter exceeds limit (1-' + builder.limit + ').' });
    } else {
        // Modified to satisfy expected Ember.js JSON structure
        // http://emberjs.com/api/data/classes/DS.RESTAdapter.html
        response.json({ books: builder.create(quantity) });
    }
});

// Backward compatibility with previous endpoint
// Consumed by e.g. https://github.com/nanotaboada/javascript
app.get('/books', function(request, response, next) {
    var results = [];
    pg.connect(connectionString, function(error, client, done) {
        if (error) {
            done();
            console.log(error);
            return response.status(500).send({ error: error });
        }
        var query = client.query('SELECT * FROM Books');
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return response.json({ books: results });
        });
    });
});

app.get('/songs', function(request, response, next) {
    var results = [];
    pg.connect(connectionString, function(error, client, done) {
        if (error) {
            done();
            console.log(error);
            return response.status(500).send({ error: error });
        }
        var query = client.query('SELECT * FROM Songs');
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return response.json(results);
        });
    });
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
        response.json({ message: error.message, error: error });
    });
}

// Production
app.use(function(error, request, response) {
    response.status(error.status || 500);
    response.json({ message: error.message, error: {} });
});

module.exports = app;