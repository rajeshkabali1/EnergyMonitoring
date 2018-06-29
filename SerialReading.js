const internetAvailable = require('internet-available');
const SerialPort = require('serialport');
var fileProcessing = require('./fileProcessing');
var mservice = require('./service');



var serialReading = module.exports = {

    connectSerialPort: function () {
        const port = new SerialPort('/dev/ttyACM0', () => {
            console.log('Port Opened');
        });
        const parsers = SerialPort.parsers;
        const parser = new parsers.Readline({
            delimiter: '\n'        
        });
        
        port.pipe(parser);
        parser.on('data', serialReading.readFromSocket);
    },

    readFromSocket: function (test_data) {
        internetAvailable({
            timeout: 4000,
            retries: 10,
        }).then(function () {
            console.log("Internet available");
            serialReading.moveDataToCloud(test_data);
        }).catch(function () {
            console.log("No internet");
            fileProcessing.writeToFile(test_data);
        });
    },

    moveDataToCloud: function (data) {
        console.log("moveDataToCloud");
        mservice.insertData(data).then(function (response) {
            console.log('moveDataToCloud response, ', response);
            if (response[0][0].return_value == 1) {
                console.log('Inserted Successfully!');
            } else {
                //fileProcessing.writeToFile(test_data);//error file?
            }
        }).catch(function (err) {
            console.log('moveDataToCloud err, ', err);
        })
    }
};