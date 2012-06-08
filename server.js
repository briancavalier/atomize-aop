var http = require('http');
var atomize = require('atomize-server');
var port = 9999;
var httpServer = http.createServer();
atomize.create(httpServer, '[/]atomize');
console.log(" [*] Listening on 0.0.0.0:" + port);
httpServer.listen(port, '0.0.0.0');
