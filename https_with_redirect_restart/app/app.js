const https = require('https');
const http = require('http');
const pem = require('pem');
const express = require('express');
const fs = require("mz/fs");
const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager;

// https://stackoverflow.com/a/7458587/2032154
const httpApp = express();
httpApp.get('*', function(req, res) {  
	res.redirect('https://' + req.headers.host + req.url);
})
const httpServer = http.createServer(httpApp).listen(80);

const httpShutdownManager = new GracefulShutdownManager(httpServer);

(async () => {
	const {key, cert} = await (async () => {
		const certdir = (await fs.readdir("/etc/letsencrypt/live"))[0];

		return {
			key: await fs.readFile(`/etc/letsencrypt/live/${certdir}/privkey.pem`),
			cert: await fs.readFile(`/etc/letsencrypt/live/${certdir}/fullchain.pem`)
		}
	})();

	const app = express()

	app.get('/', function (req, res) {
		res.send('o hai!')
	})

	const httpsServer = https.createServer({key, cert}, app).listen(443)

	const httpsShutdownManager = new GracefulShutdownManager(httpsServer);

	process.on('SIGTERM', () => {
		httpsShutdownManager.terminate(() => {
			httpShutdownManager.terminate(() => {
				console.log('Server is gracefully terminated');
			});
		});
	});
})();