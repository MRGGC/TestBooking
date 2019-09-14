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
const funcs = require('./funcs');

const config = require(__dirname + '/config');
config.session.store = new MySQLStore({config: config.mysql});

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const connection = mysql.createConnection(config.mysql);
connection.query = util.promisify(connection.query).bind(connection);

const testLookupProcedure = fs.readFileSync(__dirname + '/sql/testLookup.sql', 'utf8');
connection.query(testLookupProcedure);
const bookTestProcedure = fs.readFileSync(__dirname + '/sql/bookTest.sql', 'utf8');
connection.query(bookTestProcedure);
const updateTestProcedure = fs.readFileSync(__dirname + '/sql/updateTest.sql', 'utf8');
connection.query(updateTestProcedure);
const changePassProcedure = fs.readFileSync(__dirname + '/sql/changePass.sql', 'utf8');
connection.query(changePassProcedure);

const errorController = require(__dirname + '/controllers/errorController');
const httpController = require(__dirname + '/controllers/httpController');
const loginController = require(__dirname + '/controllers/loginController');
const pageController = require(__dirname + '/controllers/pageController');
const panelController = require(__dirname + '/controllers/panelController');
const testLookupController = require(__dirname + '/controllers/testLookupController');


function isAuthenticated(req, res, next) {
    if (req.url === '/panel' && !req.session.user) {
        res.redirect('/login');
    } else {
        next();
    }
}

app.set('view engine', 'ejs');
app.set('trust proxy', true);

app.use(session(config.session))
app.use('/assets', express.static('public'));
app.use(isAuthenticated);

pageController(app, sha1, connection, config);
panelController(app, sha1, funcs, urlencodedParser, bcrypt, connection, config);
loginController(app, urlencodedParser, connection, bcrypt, sha1, config);
errorController(app, config);

const server = https.createServer(config.keyOption, app).listen(443, () => {
                   console.log("Server is running on port 80/443...")
               });
httpController(express);

const io = require('socket.io')(server);

io.on('connection', socket => {
    testLookupController(socket, funcs, connection);
});
