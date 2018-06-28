const internetAvailable = require('internet-available');
var mservice = require('./service.js');
const fs = require('fs');

const file_dir = 'D:\\EnergyMonitoring\\Data';

var fileProcessing = module.exports = {
    readFiles: function (dirname, onFileContent, onError) {
        fs.readdir(dirname, function (err, filenames) {
            if (err) {
                onError(err);
                return;
            }
            filenames.forEach(function (filename) {
                console.log('File Name: ', filename);
                fs.readFile(dirname + '\\' + filename, 'utf-8', function (err, content) {
                    if (err) {
                        onError(err);
                        return;
                    }
                    onFileContent(filename, content);
                });
            });
        });
    },
    processFiles: function (fileName, data) {
        console.log('Processing file ', fileName);
        internetAvailable({
            timeout: 4000,
            retries: 10,
        }).then(function () {
            console.log("Internet available");
            fileProcessing.moveDataToCloudFromFile(fileName, data);
        }).catch(function () {
            console.log("No internet");
        });
    },
    moveDataToCloudFromFile: function (fileName, data) {
        console.log("moveDataToCloudFromFile");
        mservice.insertData(data).then(function (response) {
            console.log('moveDataToCloud response, ', response);
            if (response[0][0].return_value == 1) {
                console.log('File content inserted Successfully!');
                fileProcessing.deleteFile(fileName);
            } else {
                //fileProcessing.writeToFile(test_data);//error file?
            }
        }).catch(function (err) {
            console.log('moveDataToCloud err, ', err);
        })
    },
    deleteFile: function (fileName) {
        fs.unlink(file_dir + '\\' + fileName, function (err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        });
    },
    checkDir: function () {
        console.log('Checking for unprocessed data files in the folder ' + file_dir);
        fileProcessing.readFiles(file_dir,
            (name, data) => {
                console.log('on file content');
                fileProcessing.processFiles(name, data);
            },
            (err) => {
                console.log('on error' + err);
            });
    },
    writeToFile: function (dataToAppend) {
        console.log("writeToFile");
        fs.appendFile(file_dir + '\\data.txt', ("\r\n" + dataToAppend), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }

};

setInterval(function(){
    fileProcessing.checkDir();
}, 2000);
