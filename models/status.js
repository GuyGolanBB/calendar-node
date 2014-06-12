var mongoose = require('mongoose');

module.exports = mongoose.model('Status', {
	name : {type :String , required: true}
});