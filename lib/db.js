var mysql = require('mysql');

var conn =  mysql.createConnection({
    host: 'localhost',
    password : '',
    user : 'root',
    database : 'angular'
});

conn.connect(function(err){
    if(!!err) console.log(err);
    else console.log('connected');
});

module.exports= conn;