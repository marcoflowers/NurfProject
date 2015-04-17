var express = require('express');
var models = require('../models/index.js');
var shrooms = models.shrooms;
var onev = models.wins;
var ids = require('../public/js/data/ids.json');

module.exports = function(app, db) {

    /* GET home page. */
    app.get('/', function(req, res, next) {
        db.collection('shrooms').aggregate([{"$group": {"_id":"total","sum":{"$sum":"$shrooms"}}}],function(err, result) {
            console.log(result[0].sum)
            res.render('home', {shrooms: result[0].sum});
        });

    });
    /* GET matchup data. */
    app.post('/', function(req, res, next) {
        console.log(req.body);
        var data = req.body;
        var id1 = ids[data.champ1];
        var id2 = ids[data.champ2];
        var query = [id1, id2];
        query.sort();
        db.collection('onev').findOne({"_id":query.join('-')},function(err, result) {
            var onevone = result
            db.collection("champ_stats").findOne({"_id":parseInt(id1)},function(err,result){
                var champ1 = result
                db.collection("champ_stats").findOne({"_id":parseInt(id2)},function(err,result){
                    var champ2 = result
                    var output = onevone
                    var wins1 = output[id1]
                    var wins2 = output[id2]
                    champ1["head"] = wins1
                    champ2["head"] = wins2
                    output[id1] = champ1
                    output[id2] = champ2
                    console.log(output)
                    res.json(output)
                })
            })
        });
    });


};
