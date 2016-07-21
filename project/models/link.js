var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Link = new Schema({
    link: { type: String, required: true }, // url
    date: { type: Date, default: Date.now, required: false }, // creation date
});

module.exports = {
    model: mongoose.model('Link', Link),
    Schema: Link
};
