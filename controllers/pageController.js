module.exports = (app, config) => {

    app.get('/', (req, res) => {
        res.render('bookings', config.client);
    });

    app.get('/login', (req, res) => {
        if (req.query.err) {
            config.client.err = decodeURIComponent(req.query.err);
        } else {
            config.client.err = '';
        }

        res.render('login', config.client);
    });

    app.get('/book', (req, res) => {
        res.end('lmao');
    });

}
