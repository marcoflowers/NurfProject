var mongoose = require('mongoose');

var shroomSchema = mongoose.Schema({
    _id: String,
    shrooms: Number
}, {collection:"shrooms"});


module.exports = mongoose.model('Shrooms', shroomSchema);
