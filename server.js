#!/usr/bin/env node

var app = require('./app');
var winston = require('winston');
var port = process.env.PORT || '8888';

winston.log('info', 'Express server started.');

app.set('port', port);

app.listen(port, function() {
    winston.log('info', 'Express server listening on port ' + port);
});

winston.log('info', 'Express server stopped.');