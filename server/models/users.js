const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  carrots: Array
});
module.exports = mongoose.model('Users',userSchema);