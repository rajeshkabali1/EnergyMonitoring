const internetAvailable = require('internet-available');
var fileProcessing = require('./fileProcessing.js');
var mservice = require('./service.js');

var serialReading = module.exports = {

    readFromSocket: function () {
        var test_data = "test data";
        internetAvailable({
            timeout: 4000,
            retries: 10,
        }).then(function () {
            console.log("Internet available");
            moveDataToCloud(test_data);
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