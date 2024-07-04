var mysql = require('mysql')

 const dbConf = mysql.createConnection({
    host:"localhost",
    user:'root',
    password:'1234',
    database:'StudentskaPlatforma',
})




module.exports = dbConf