const http = require('http');
var serialReading = require('./serialReading');
let logger = require('./logger');

const hostname = '127.0.0.1';
const port = 3000;



const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
  logger.info(`Server running at http://${hostname}:${port}/`);
  init();

});

var init = function(){
  // serialReading.connectSerialPort();
  serialReading.readFromSocket('evwbwb');
}







