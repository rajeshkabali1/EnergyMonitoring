const mysql = require('mysql');
let config = require('./config.js');
var Promise = require('promise');

var pool = mysql.createPool(config);

let service = {
    insertData: function (data) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) reject(err);
                connection.query('CALL Insert_Raw_Data(?,?)', [data, new Date()], (error, results, fields) => {
                    connection.release();
                    if (error) reject(error);
                    console.log('insertData, ',results);
                    resolve(results);
                });
            });
        });
    }
}

module.exports = service;