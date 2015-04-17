var express = require('express');
var models = require('../models/index.js');
var shrooms = models.shrooms;
var onev = models.wins;
var ids = require('../public/js/data/ids.json');

module.exports = function(app, db) {

    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('home', {shrooms: 500});
    });
    /* GET matchup data. */
    app.post('/', function(req, res, next) {
        console.log(req.body);
        var data = req.body;
        var id1 = ids[data.champ1];
        var id2 = ids[data.champ2];
        var query = [id1, id2];
        query.sort();
        console.log(query.join('-'));
        var doc = onev.find({_id:query.join('-')}).toObject();
        console.log(doc);
        res.json(doc);
    });


};
