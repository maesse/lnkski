var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Link = require("./link").Schema;
var findOrCreate = require("mongoose-findorcreate");


var Account = new Schema({

    local            : {
        username     : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    links: [Link]
});

Account.plugin(findOrCreate);

module.exports = mongoose.model('Account', Account);
