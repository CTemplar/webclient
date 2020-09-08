const f = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';
const fs = require('fs');

fs.readFile(f, 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	let result = data.replace(/node: false/g, "node: {crypto: true, stream: true, dns: 'empty', net: 'empty', fs: 'empty', tls: 'empty'}");

	fs.writeFile(f, result, 'utf8', function (error) {
		if (error) return console.log(error);
	});
})
