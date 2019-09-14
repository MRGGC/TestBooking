module.exports = (socket, funcs, connection) => {

    socket.on('getTests', info => {

        let {date, grade} = info;
        date = funcs.date2sqlDate(info.date);

        connection.query(`CALL testLookup('${date}', ${grade});`, (err, res) => {
            if (err)
                return err;

            const tests = res[0];

            // Sending Prepare txt as char codes
            for (let test of tests) {
                test.prepare = encodeURIComponent(test.prepare);
            }

            socket.emit('recieveTests', tests);

        });

    });

};
