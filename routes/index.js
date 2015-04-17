var express = require('express');
var ids = require('../public/js/data/ids.json');

module.exports = function(app, db) {

    /* GET home page. */
    app.get('/', function(req, res, next) {
        db.collection("shrooms").aggregate([{
            $group:{_id:null, shroomspergame:{$avg:"$shrooms"}}
        }], function(err, result) {
            res.render('home', {shrooms: Math.round(result[0].shroomspergame)});
        });
    });
    /* GET matchup data. */
    app.post('/', function(req, res, next) {
        var data = req.body;
        var id1 = ids[data.champ1];
        var id2 = ids[data.champ2];
        var query = [id1, id2];
        query.sort();
        db.collection('onev').find({_id:query.join('-')}).toArray(function(err, result) {
            console.log(result);
            if(result.length !== 0) {
                result = result[0];
                var output = {};
                output[data.champ1] = result[id1];
                output[data.champ2] = result[id2];
                res.json(output);
            } else {
                res.json({err: "No data found"});
            }
        });
    });


};
