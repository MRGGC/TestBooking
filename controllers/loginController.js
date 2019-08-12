module.exports = (app, urlencodedParser, connection, bcrypt, sha1, config) => {

    app.post('/login', urlencodedParser, (req, res) => {

        const {uname, pass, remember} = req.body;
        let logged = false;

        connection.query(`SELECT * FROM accounts`, (err, ls) => {

            ls.forEach(account => {

                if (account.username === sha1(uname) && bcrypt.compareSync(pass, account.password)) {
                    logged = true;
                }

            });

            if (logged) {

                req.session.regenerate(() => {
                    req.session.user = uname;

                    if (remember === 'on') {
                        req.session.cookie.maxAge = config.session.rememberMeAge;
                    }

                    req.session.save(() => {
                        res.redirect('/book');
                    });
                });

            } else {
                res.redirect('/login?err=' + encodeURIComponent('Invalid username or password.'));
            }

        });

    });

    app.get('/logout', (req, res) => {

        req.session.destroy(() => res.redirect('/'));

    });

}
