const mysql = require('mysql');
let config = require('./config.js');

var pool = mysql.createPool(config);

let service = {
    insertData : function (data, generated_time) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(results[0]);
                return console.error(err);
            };

            connection.query('CALL Insert_Raw_Data(?,?)', [data, generated_time], (error, results, fields) => {
                if (error) {
                    connection.release();
                    return console.error(error.message);
                }
                console.log(results[0][0].return_value);
                connection.release();
            });

        });
    }
}

module.exports = service;