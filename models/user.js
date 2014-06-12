var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	Schema = mongoose.Schema,
	SALT_WORK_FACTOR = 10,

// define the schema for our user model
	userSchema = Schema({
	 	username : {type : String , required: true, unique : true},
		password : {type : String, required : true },
		name : {type : String, required : true},
		is_admin: { type: Boolean, default: false },
		created: { type: Date, default: Date.now }		    
	});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);