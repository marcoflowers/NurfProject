var express = require('express');
var ids = require('../public/js/data/ids.json');
var champs = require('../public/js/data/champs.json');
module.exports = function(app, db) {

    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('home', {});
    });
    /* GET matchup data. */
    app.post('/', function(req, res, next) {
        var data = req.body;
        var id1 = ids[data.champ1];
        var id2 = ids[data.champ2];
        var query = [id1, id2];
        query.sort();
        db.collection('onev').find({_id:query.join('-')}).toArray(function(err, result) {
            if(result.length !== 0) {
                result = result[0];
                var output = {};
                var data1 = result[id1];
                var data2 = result[id2];
                db.collection("champ_stats").findOne({"_id":parseInt(id1)},function(err,result){
                var champ1 = result;
                    db.collection("champ_stats").findOne({"_id":parseInt(id2)},function(err,result) {
                        var champ2 = result;
                        output[data.champ1] = champ1;
                        output[data.champ1].head = data1;
                        output[data.champ2] = champ2;
                        output[data.champ2].head = data2;
                        console.log(output);
                        res.json(output);
                    });
                });
                //res.json(output);
            } else {
                res.json({err: "No data found"});
            }
        });
    });
    app.get('/leaderboard', function(req, res, next) {
        db.collection('champ_stats').find().sort({solo_perc:-1}).limit(10).toArray(function(err, result) {
            winners = result;
            db.collection('champ_stats').find().sort({solo_perc:1}).limit(10).toArray(function(err, result) {
                losers = result;
                for (i = 0; i < winners.length; i++) {
                    winners[i].champ = champs[winners[i]._id];
                }
                for (i = 0; i < losers.length; i++) {
                    losers[i].champ = champs[losers[i]._id];
                }
                res.render('leaderboard', {winners: winners,losers:losers});
            });
        });
    });

    app.get('/about', function(req, res, next) {
        db.collection('match_ids').count({found:1}, function(err, count) {
            db.collection('shrooms').aggregate([{
                $group:{_id:null, shrooms:{$sum:"$shrooms"}}
            }], function(err, shrooms) {
                shrooms = shrooms[0].shrooms;
                res.render("about", {shrooms:shrooms, matches: count});
            });
        });
    });


};
