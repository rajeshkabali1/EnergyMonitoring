const fs = require('fs');
const internetAvailable = require('internet-available');
var uniqid = require('uniqid');
var mservice = require('./service');
var logger = require('winston');   


const file_dir = 'D:\\EnergyMonitoring\\Data';

var fileProcessing = module.exports = {

    readFiles: function (dirname, onFileContent, onError) {
        fs.readdir(dirname, function (err, filenames) {
            if (err) return onError(err);
            filenames.forEach(function (filename) {
                logger.info('File Name: ', filename);
                fs.readFile(dirname + '\\' + filename, 'utf-8', function (err, content) {
                    if (err) return onError(err);
                    onFileContent(filename, content);
                });
            });
        });
    },

    processFiles: function (fileName, data) {
        logger.info('Processing file ', fileName);
        internetAvailable({
            timeout: 4000,
            retries: 10,
        }).then(function () {
            fileProcessing.moveDataToCloudFromFile(fileName, data);
        }).catch(function (err) {
            onError(err);
        });
    },

    moveDataToCloudFromFile: function (fileName, data) {
        logger.info("moveDataToCloudFromFile");
        mservice.insertData(data).then(function (response) {
            logger.info('moveDataToCloud response, ', response);
            if (response[0][0].return_value == 1) {
                logger.info('File content inserted Successfully!');
                fileProcessing.deleteFile(fileName);
            } else {
                //fileProcessing.writeToFile(test_data);//error file?
            }
        }).catch(function (err) {
            onError(err);
        })
    },

    deleteFile: function (fileName) {
        fs.unlink(file_dir + '\\' + fileName, function (err) {
            if (err) return onError(err);
            logger.info('file deleted successfully');
        });
    },

    checkDir: function () {
        logger.info('Checking for unprocessed data files in the folder ' + file_dir);
        fileProcessing.readFiles(file_dir,
            (name, data) => {
                logger.info('on file content');
                fileProcessing.processFiles(name, data);
            },
            (err) => {
                onError(err);
            }
        );
    },

    writeToFile: function (dataToAppend) {
        logger.info("writeToFile");
        var fileName = file_dir + '\\' + uniqid('data') + '.txt';
        fs.writeFile(fileName, dataToAppend, function (err) {
            if (err) onError(err);
            logger.info('Saved!' + fileName);
        });
    }
};

var onError = function (err) {
    logger.info(err.message);
}

setInterval(function () {
    fileProcessing.checkDir();
}, 2000);
