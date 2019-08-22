module.exports = {

    date2sqlDate: function(date) {
        const d = date.split('/');
        [d[0], d[1], d[2]] = [d[2], d[0], d[1]];

        return d.join('-');
    }

};
