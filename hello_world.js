const http = require('http');
var fs = require('fs');
var internetAvailable = require("internet-available");

const hostname = '127.0.0.1';
const port = 3000;
var file_dir = 'D:\\EnergyMonitoring\\Data';


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      console.log('File Name: ',filename);
      fs.readFile(dirname + '\\' +filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

function checkDir(){
  console.log('Checking for unprocessed data files in the folder ' + file_dir);
  readFiles(file_dir, 
    (name, data) => {
      console.log('on file content');
      processFiles(name, data);
    }, 
    (err) => {
      console.log('on error'+ err);
    });
}

setInterval(checkDir, 2000);

function processFiles(filename, data){
  console.log('Processing file ', filename);
  internetAvailable({
    timeout: 4000,
    retries: 10,
  }).then(function(fileName, data){
    console.log("Internet available");
    moveDataToCloud();
  }).catch(function(){
    console.log("No internet");
    writeToFile();
  });
}

function moveDataToCloud(){
  console.log("moveDataToCloud");
}

function writeToFile(){
  console.log("writeToFile");
};


