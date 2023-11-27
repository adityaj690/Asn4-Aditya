var mongoose = require('mongoose')
var Schema = mongoose.Schema;
invoiceSchema = new Schema({
    ISBN: String,
    title: String,
    author: String,
    img: String,
    inventory:Number,
    category:String,
    Price_in_thousand: Number,
    manufacturer: String
})
module.exports = mongoose.model('Invoice' , invoiceSchema)