module.exports = express => {
    const http = express();

    http.get('*', (req, res) => {
        res.redirect(`https://${req.headers.host + req.url}`);
    });

    http.listen(80);
}
