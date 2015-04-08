var express = require('express');

module.exports = function(app) {

    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('home', {shrooms: 500});
    });
    /* GET matchup data. */
    app.post('/', function(req, res, next) {
        console.log(req.body);
        var data = req.body;

        res.json();
    });

}
