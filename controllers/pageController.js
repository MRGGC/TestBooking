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

    app.get('/panel', async (req, res) => {

        const user = sha1(req.session.user);

        for (let i = 1; i <= 3; i++) {
            if (req.query['err' + i]) {
                config.client['err' + i] = decodeURIComponent(req.query['err' + i]);
            } else {
                config.client['err' + i] = '';
            }

            if (req.query['success' + i]) {
                config.client['success' + i] = decodeURIComponent(req.query['success' + i]);
            } else {
                config.client['success' + i] = '';
            }
        }

        const d = await connection.query(`SELECT grades, subject_id FROM teachers WHERE username="${user}"`);
        const {grades, subject_id} = d[0];

        const subjects = await connection.query(`SELECT * FROM subjects WHERE subject_id IN (${subject_id})`);

        const teacherTests = await connection.query(`SELECT * FROM tests WHERE teacher="${user}"`);

        const teacher = await connection.query(`SELECT CONCAT(first_name, ' ', last_name) AS teacher FROM teachers WHERE username="${user}"`);

        config.client.grades = grades.split(',');
        config.client.subjects = subjects;
        config.client.tests = teacherTests;
        config.client.profile = {};
        config.client.profile.name = teacher[0].teacher;

        res.render("panel", config.client);

    });

}
