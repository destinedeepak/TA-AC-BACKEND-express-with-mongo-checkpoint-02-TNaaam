var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  title:{type: String, required: true},
  summary: String,
  host: String,
  start_date:Date,
  end_date: Date,
  category:[String],
  location: String,
  like: {type: Number, default:0},
  dislike: {type: Number, default:0},
  cover_image_url : {type: String},
  remark: [{type:Schema.Types.ObjectId, ref:'Remark'}]
}, {timestamps: true})

module.exports = mongoose.model('Event', eventSchema);
