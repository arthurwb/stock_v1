const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  carrots: Map,
});
module.exports = mongoose.model('Users',userSchema);