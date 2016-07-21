var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Link = require("./link").Schema;
var passportLocalMongoose = require('passport-local-mongoose');



var Account = new Schema({
    username: String,
    password: String,
    links: [Link]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
