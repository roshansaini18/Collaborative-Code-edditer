// backend/models/Room.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  avatar: { type: String }, // optional
}, { _id: false });

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  code: { type: String, default: '' },
  messages: { type: [messageSchema], default: [] },
  users: { type: [userSchema], default: [] },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
