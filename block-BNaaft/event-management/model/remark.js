var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var remarkSchema = new Schema({
  content:{type: String, required: true},
  author: String,
  like: {type: Number, default:0},
  dislike: {type: Number, default:0},
  event:{type:Schema.Types.ObjectId, ref:"Event"}
}, {timestamps: true})

module.exports = mongoose.model('Remark', remarkSchema);
