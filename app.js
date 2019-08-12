const express = require('express');
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const sha1 = require('sha1');
const bcrypt = require('bcrypt');
const util = require('util');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const MySQLStore = require('connect-mysql')(session);

const config = require(__dirname + '/config');
config.session.store = new MySQLStore({config: config.mysql});

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
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


function isAuthenticated(req, res, next) {
    if (req.url.split('?')[0] === '/' || req.url.split('?')[0] === '/login' || req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.set('view engine', 'ejs');
app.set('trust proxy', true);

app.use(session(config.session))
app.use('/assets', express.static('public'));
app.use(isAuthenticated);

pageController(app, config);
loginController(app, urlencodedParser, connection, bcrypt, sha1, config);

const server = https.createServer(config.keyOption, app).listen(443, () => {
                   console.log("Server is running on port 80/443...")
               });
httpController(express);

const io = require('socket.io')(server);

io.on('connection', socket => {
    testLookupController(socket, connection);
});
