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

CarSalesSchema = new Schema({
    InvoiceNo: String,
    image: String,
    Manufacturer: String,
    class: String,
    Sales_in_thousands:Number,
    __year_resale_value:Number,
    Price_in_thousands: Number,
    Vehicle_type: String,
    Engine_size: Number,
    Horsepower: Number,
    Wheelbase: Number,
    Width: Number,
    Length: Number,
    Curb_weight: Number,
    Fuel_capacity: Number,
    Fuel_efficiency: Number,
    Latest_Launch: String,
    Power_perf_factor: Number,

})
module.exports = mongoose.model('CarSales' , CarSalesSchema)

/********************************************************************************* * 
 * ITE5315 – Assignment 4 * 
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. *
 *  No part of this assignment has been copied manually or electronically from any other source * 
 * (including web sites) or distributed to other students. * *
 *  Name: Aditya Joshi Student ID: n01545536 Date: November 26, 2023 * 
 * * ********************************************************************************/