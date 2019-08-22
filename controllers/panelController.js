module.exports = (app, sha1, funcs, urlencodedParser, connection, config) => {

    app.post('/book', urlencodedParser, (req, res) => {

        const teacher = sha1(req.session.user);

        let {
            date,
            subject,
            grade,
            type,
            prep
        } = req.body;
        date = funcs.date2sqlDate(date);

        // if 2 tests are already booked
        connection.query(`SELECT test_id FROM tests WHERE date="${date}" AND grade=${grade}`, (err, data) => {
            if (err)
                return err;

            console.log(data.length);

            if (data.length >= 2)
                return res.redirect('/panel?err=' + encodeURIComponent("2 tests are already booked for this date."));

            // if user tried to book grade/subject/type that he is not allowed
            connection.query(`SELECT grades, subject_id FROM teachers WHERE username="${teacher}"`, (err, data) => {
                if (err)
                    return err;

                data = data[0];
                data.grades = data.grades.split(',');
                data.subject_id = data.subject_id.split(',');

                if (!data.grades.includes(grade) || !data.subject_id.includes(subject) || !['Q', 'T', 'B'].includes(type)) {
                    return res.redirect('/panel?err=' + encodeURIComponent("Something went wrong."));
                }

                // else if everything ok
                connection.query(`CALL bookTest("${date}", ${subject}, ${grade}, '${type}', "${prep}", "${teacher}")`, (err) => {
                    if (err)
                        return err;

                    return res.redirect('/panel');
                });
            });
        });

    });

}
