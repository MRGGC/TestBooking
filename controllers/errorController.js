module.exports = (app, config) => {

    app.use((req, res, next) => {
        res.render("error404", config.client);
    });

}
