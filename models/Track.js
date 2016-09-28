var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};


var TrackSchema = new mongoose.Schema({
	name: String,
 	pid: String,
 	uid: String,
 	umail: String,
 	price: Number,
 	pic: String,
 	track: Boolean,
	CreateDate: String,
	UpdateDate: String
}, schemaOptions);

var Track = mongoose.model('Track', TrackSchema);

module.exports = Track;