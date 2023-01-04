const https = require('https');
const fs = require('fs');
const host = 'localhost';
const port = 8000;
const defaultCountDownTime = 120;
let seconds = defaultCountDownTime;
let timer;

const countdown = function() {
	clearInterval(timer);

	timer = setInterval(() => {
		if (seconds <= 0) {
			clearInterval(timer);
		}

		seconds -= 1;
		console.log(seconds);
	}, 1000);
}
countdown();

const options = {
	// run in node directory to generate key and cert permissions
	// openssl genrsa -out key.pem
	// openssl req -new -key key.pem -out csr.pem
	// openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
	// rm csr.pem

	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};


const requestListener = function(req, res) {
	switch (req.url) {
		case "/reset":
			seconds = defaultCountDownTime;
			countdown();
	}

	let pageContents = `while(1);
{"sp":${seconds},"sr":${seconds}}`;

	res.setHeader('Cache-Control', 'no-cache,must-revalidate,max-age=0,no-store,private');
	res.setHeader('Content-Type', 'application/json; charset=UTF-8');
	res.setHeader('Access-Control-Allow-Origin', '*');

	res.writeHead(200);
	res.end(pageContents);
};

const server = https.createServer(options, requestListener);
server.listen(port, host, () => {
	console.log(`Server is running on https://${host}:${port}`);
});
