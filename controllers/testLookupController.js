module.exports = (socket, connection, utf8) => {

    socket.on('getTests', info => {

        const date2sqlDate = date => {

            const d = date.split('/');
            [d[0], d[1], d[2]] = [d[2], d[0], d[1]];

            return d.join('-');
        }

        let {date, grade} = info;
        date = date2sqlDate(info.date);

        connection.query(`CALL testLookup('${date}', ${grade});`, (err, res) => {
            if (err)
                return err;

            const tests = res[0];

            // Sending Prepare txt as char codes
            for (let test of tests) {
                const code = [];

                for (let c of test.prepare) {
                    code.push(c.charCodeAt());
                }

                console.log(code);

                test.prepare = code;
            }

            socket.emit('recieveTests', tests);

        });

    });

};
