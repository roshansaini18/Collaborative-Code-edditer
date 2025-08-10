// backend/services/socketService.js
let ioInstance = null;

function init(io) {
  ioInstance = io;
}

function getIO() {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized. Call init(io) first.');
  }
  return ioInstance;
}

function emitToRoom(roomId, event, payload) {
  if (!ioInstance) return;
  ioInstance.in(roomId).emit(event, payload);
}

module.exports = {
  init,
  getIO,
  emitToRoom,
};