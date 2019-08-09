const express = require('express');
const https = require('https');
const fs = require('fs');
const util = require('util');
const mysql = require('mysql');

const config = require(__dirname + '/config');

const app = express();
const connection = mysql.createConnection(config.mysql);
connection.query = util.promisify(connection.query);

// Loading testLookup.sql
const testLookupProcedure = fs.readFileSync(__dirname + '/testLookup.sql', 'utf8');
connection.query(testLookupProcedure);

const errorController = require(__dirname + '/controllers/errorController');
const httpController = require(__dirname + '/controllers/httpController');
const loginController = require(__dirname + '/controllers/loginController');
const pageController = require(__dirname + '/controllers/pageController');
const testLookupController = require(__dirname + '/controllers/testLookupController');

const keyOption = {
    key: fs.readFileSync(__dirname + '/SSL/server.key'),
    cert: fs.readFileSync(__dirname + '/SSL/server.cert')
}

app.set('view engine', 'ejs');
app.use('/assets', express.static('public'));

pageController(app, config);

const server = https.createServer(keyOption, app).listen(443, () => {
                   console.log("Server is running on port 80/443...")
               });
httpController(express);

const io = require('socket.io')(server);

io.on('connection', socket => {
    testLookupController(socket, connection);
});
