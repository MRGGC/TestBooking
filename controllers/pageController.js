module.exports = (app, config) => {

    app.get('/', (req, res) => {
        const info = {
            title: config.title
        };
        res.render('bookings', info);
    });

}
