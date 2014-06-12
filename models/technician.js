var mongoose = require('mongoose');

module.exports = mongoose.model('Technician', {
	name : {type :String , required: true},
	phone: {type :String , required: true},
	isActive : Boolean,
	appointments : [{type : mongoose.Schema.Types.ObjectId, ref: 'Appointment'}]
});