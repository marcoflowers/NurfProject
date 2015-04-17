var mongoose = require('mongoose');

var winSchema = mongoose.Schema({
    _id: String,
}, {collection: "onev"});


module.exports = mongoose.model('Wins', winSchema);
