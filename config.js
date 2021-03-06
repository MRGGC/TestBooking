const fs = require('fs');
const uuid = require('uuid/v4');
const sha1 = require('sha1');

const random = (min, max) => Math.floor(Math.random(max - min)) + min;
const randomStr = len => new Array(len).map(_ => String.fromCharCode(random(33, 126))).join('');

module.exports = {
    client: {
        title: 'Test Booking',
        prepareMaxLength: 32,
        popupSpeed: 300,
        noTestMsg: "Yooho! No tests!",
        prepTxtMaxLength: 512
    },
    keyOption: {
        key: fs.readFileSync(__dirname + '/SSL/server.key'),
        cert: fs.readFileSync(__dirname + '/SSL/server.cert')
    },
    mysql: {
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOSTNAME,
        multipleStatements: true,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
    session: {
        secret: sha1(randomStr(64)),
        genid: uuid,
        name: 'sess',
        resave: true,
        saveUninitialized: false,
        maxAge: 1.5 * 60 * 60 * 1000, //1.5 hour
        rememberMeAge: 3 * 24 * 60 * 60 * 1000, //3 days
        cookie: {
            path: '/',
            sameSite: 'strict',
            httpOnly: true,
            secure: true
        }
    },
    crypt: {
        salt_rounds: 13
    }
}
