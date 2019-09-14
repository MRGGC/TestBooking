module.exports = (app, sha1, funcs, urlencodedParser, bcrypt, connection, config) => {

    app.post('/book', urlencodedParser, async (req, res) => {

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
        const tests = await connection.query(`SELECT COUNT(*) AS count FROM tests WHERE date="${date}" AND grade=${grade}`);

        if (tests[0].count >= 2) {
            await res.redirect('/panel?err1=' + encodeURIComponent("2 tests are already booked for this date."));
            return;
        }

        // if user tried to book grade/subject/type that he is not allowed
        let allowed = await connection.query(`SELECT grades, subject_id FROM teachers WHERE username="${teacher}"`);

        allowed = allowed[0];
        allowed.grades = allowed.grades.split(',');
        allowed.subject_id = allowed.subject_id.split(',');

        if (!allowed.grades.includes(grade) || !allowed.subject_id.includes(subject) || !['Q', 'T', 'B'].includes(type)) {
            await res.redirect('/panel?err1=' + encodeURIComponent("Something went wrong."));
            return;
        }

        // else if everything ok
        const c = await connection.query(`CALL bookTest("${date}", ${subject}, ${grade}, '${type}', "${prep}", "${teacher}")`);

        return res.redirect('/panel?success1=' + encodeURIComponent("Successfuly booked the test."));

    });

    app.post('/update', urlencodedParser, async (req, res) => {

        const teacher = sha1(req.session.user);

        let {
            date,
            grade,
            subject,
            type,
            prep,
            test_id
        } = req.body;
        date = funcs.date2sqlDate(date);

        const tests = await connection.query(`SELECT test_id FROM tests WHERE teacher="${teacher}"`);

        for (let t of tests) {
            if (t.test_id == test_id) {

                // if user tried to book grade/subject/type that he is not allowed
                let allowed = await connection.query(`SELECT grades, subject_id FROM teachers WHERE username="${teacher}"`);

                allowed = allowed[0];
                allowed.grades = allowed.grades.split(',');
                allowed.subject_id = allowed.subject_id.split(',');

                if (!allowed.grades.includes(grade) || !allowed.subject_id.includes(subject) || !['Q', 'T', 'B'].includes(type)) {
                    await res.redirect('/panel?err2=' + encodeURIComponent("Something went wrong."));
                    return;
                }

                // else if everything ok
                await connection.query(`CALL updateTest("${date}", ${subject}, ${grade}, '${type}', "${prep}", ${test_id})`);

                return res.redirect('/panel?success2=' + encodeURIComponent("Successfuly edited the test."));

            }
        }

    });

    app.post('/changepass', urlencodedParser, async (req, res) => {

        const teacher = sha1(req.session.user);

        let {
            current_pass,
            new_pass,
            cnew_pass
        } = req.body;

        if (new_pass != cnew_pass) {
            return res.redirect("/panel?err3=" + decodeURIComponent("Your new and re-typed passwords don't match."));
        }

        let pass = await connection.query(`SELECT password FROM accounts WHERE username="${teacher}"`);
        pass = pass[0].password;

        const match = bcrypt.compareSync(current_pass, pass);

        if (match) {

            new_pass = bcrypt.hashSync(new_pass, config.crypt.salt_rounds);
            await connection.query(`CALL changePass("${teacher}", "${new_pass}")`);
            res.redirect("/logout");

        } else {
            return res.redirect("/panel?err3=" + decodeURIComponent("Invalid password."));
        }

    });

    app.delete('/remove', urlencodedParser, async (req, res) => {

        const {id} = req.body;
        const teacher = sha1(req.session.user);

        const tests = await connection.query(`SELECT test_id, teacher FROM tests`);

        for (let test of tests)
            if (test.test_id == id && test.teacher == teacher)
                connection.query(`DELETE FROM tests WHERE test_id=${id}`, (err) => {
                    if (err)
                        return err;

                    res.end();
                });

    });

}
