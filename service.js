const mysql = require('mysql');
var logger = require('winston');   
var Promise = require('promise');
let config = require('./config');


var pool = mysql.createPool(config.database);

let service = {
    insertData: function (data) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) reject(err);
                connection.query('CALL Insert_Raw_Data(?,?)', [data, new Date()], (error, results, fields) => {
                    connection.release();
                    if (error) reject(error);
                    logger.info('insertData, ',results);
                    resolve(results);
                });
            });
        });
    }
}

module.exports = service;