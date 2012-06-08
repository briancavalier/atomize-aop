// Simple http + atomize server app

var express, atomize, path, port, app;

express = require('express');
atomize = require('atomize-server');
path = require('path');

port = 9999;

app = express.createServer();
app.configure(function () {
	app.use(express.logger('dev'));
	app.use(app.router);
	app.use(express.static(__dirname));
});

function serveJS(fileName, packageName) {
	var p;
	try {
		p = require.resolve(packageName);
		p = path.dirname(p);
		p = path.join(path.join(p, 'lib'), fileName);
	} catch (err) {
		p = require.resolve('atomize-server');
		p = path.dirname(p);
		p = path.join(
			path.join(
				path.join(
					path.join(p, 'node_modules'),
					packageName),
				'lib'),
			fileName);
	}
	app.get('/' + fileName, function (req, res) {
		res.sendfile(p);
	});
}

serveJS('atomize.js', 'atomize-client');
serveJS('cereal.js', 'cereal');
serveJS('compat.js', 'atomize-client');
atomize.create(app, '[/]atomize');
console.log(" [*] Listening on 0.0.0.0:" + port);
app.listen(port, '0.0.0.0');