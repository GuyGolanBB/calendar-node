var mongoose = require('mongoose');

module.exports = mongoose.model('JobType', {
	name : {type :String , required: true},
	score: {type : Number , required: true},
});