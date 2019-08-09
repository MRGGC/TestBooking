module.exports = (app, config) => {

    app.get('/', (req, res) => {
        res.render('bookings', config.client);
    });

}
