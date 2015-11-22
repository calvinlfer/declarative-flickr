'use strict';
const http = require('http');
const statFiles = require('node-static');
const file = new statFiles.Server('./public');

http.createServer((req, res) => {
       file.serve(req, res);
}).listen(8080);