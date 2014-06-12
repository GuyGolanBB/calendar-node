var mongoose = require('mongoose');

module.exports = mongoose.model('Client', {
	name : {type :String , required: true},
	cIndex : {type :String , required: true},
	city : {type :String , required: true},
	street: {type :String , required: true},
	phone :  {type :String , required: true},
	contacts : [{ name : String, number : String}],
	notes : String,
	mokedKavi : String,
	mokedAlchuti : String
});