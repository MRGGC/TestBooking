module.exports = (app, sha1, connection, config) => {

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

    app.get('/panel', (req, res) => {

        const user = sha1(req.session.user);

        if (req.query.err) {
            config.client.err = decodeURIComponent(req.query.err);
        } else {
            config.client.err = '';
        }

        connection.query(`SELECT grades, subject_id FROM teachers WHERE username="${user}"`, (err, data) => {
            if (err)
                return err;

            const {grades, subject_id} = data[0];

            connection.query(`SELECT * FROM subjects WHERE subject_id IN (${subject_id})`, (err, subjects) => {

                config.client.grades = grades.split(',');
                config.client.subjects = subjects;

                res.render("panel", config.client);

            });
        });

    });

}
