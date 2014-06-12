var mongoose = require('mongoose');

module.exports = mongoose.model('Appointment', {
	startTime : {type :Date, required: true},
	endTime : {type : Date, required: true},
	problem: {type : String , required: true},
	status: {type : mongoose.Schema.Types.ObjectId, ref: 'Status', required: true},
	client: {type : mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
	sms : Boolean,
	approve: Boolean,
	jobType : {type : mongoose.Schema.Types.ObjectId, ref: 'JobType' , required: true},
	notes: String,
	createdBy: {type : mongoose.Schema.Types.ObjectId, ref: 'User'}	,
	createdDate : { type : Date, default : new Date()},
	lastUpdatedBy:{type : mongoose.Schema.Types.ObjectId, ref: 'User'},
	updatedDate: { type : Date}
});