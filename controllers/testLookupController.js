module.exports = (socket, connection) => {

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

            socket.emit('recieveTests', res);
        });

    });

};
