// // backend/controllers/codeController.js
// const Room = require('../models/Room');


// const saveCode = async (req, res) => {
//     const { roomId } = req.params;
//     const { code } = req.body;

//     if (!code) {
//         return res.status(400).json({ message: 'Code is required.' });
//     }

//     try {
//         const room = await Room.findOneAndUpdate(
//             { roomId },
//             { code: code },
//             { new: true, upsert: false } // upsert: false to avoid creating a new room
//         );

//         if (!room) {
//             return res.status(404).json({ message: 'Room not found.' });
//         }

//         return res.status(200).json({ message: 'Code saved successfully.' });
//     } catch (error) {
//         console.error('Error saving code:', error);
//         return res.status(500).json({ message: 'Internal server error.' });
//     }
// };


// const getCode = async (req, res) => {
//   console.log('API: received request to get code.');
//   const { roomId } = req.params;
//   if (!roomId) {
//     console.error('API: missing roomId.');
//     return res.status(400).json({ message: 'roomId required' });
//   }

//   try {
//     const room = await Room.findOne({ roomId });
//     if (!room) {
//       console.log(`API: Room ${roomId} not found.`);
//       return res.status(404).json({ message: 'Room not found' });
//     }
//     console.log(`API: Retrieved code for room ${roomId}.`);
//     return res.status(200).json({ code: room.code });
//   } catch (err) {
//     console.error('API: getCode error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };


const Room = require('../models/Room');
const { v4: uuidv4 } = require('uuid'); // Import uuid

// New function to create a room
const createRoom = async (req, res) => {
    try {
        const newRoomId = uuidv4();
        const newRoom = new Room({
            roomId: newRoomId,
            code: '// Start coding here!\n\n', // Initial code
        });
        await newRoom.save();
        console.log(`API: Created new room ${newRoomId}`);
        return res.status(201).json({ roomId: newRoomId });
    } catch (error) {
        console.error('Error creating room:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// New function to check if a room exists
const checkRoom = async (req, res) => {
    const { roomId } = req.params;
    try {
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }
        return res.status(200).json({ message: 'Room exists.' });
    } catch (error) {
        console.error('Error checking room:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const saveCode = async (req, res) => {
    // ... (This function remains unchanged)
    const { roomId } = req.params;
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Code is required.' });
    }

    try {
        const room = await Room.findOneAndUpdate(
            { roomId },
            { code: code },
            { new: true, upsert: false } // upsert: false is correct, it prevents creating rooms here
        );

        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        return res.status(200).json({ message: 'Code saved successfully.' });
    } catch (error) {
        console.error('Error saving code:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const getCode = async (req, res) => {
    // ... (This function remains unchanged)
    console.log('API: received request to get code.');
    const { roomId } = req.params;
    if (!roomId) {
        console.error('API: missing roomId.');
        return res.status(400).json({ message: 'roomId required' });
    }

    try {
        const room = await Room.findOne({ roomId });
        if (!room) {
            console.log(`API: Room ${roomId} not found.`);
            return res.status(404).json({ message: 'Room not found' });
        }
        console.log(`API: Retrieved code for room ${roomId}.`);
        return res.status(200).json({ code: room.code });
    } catch (err) {
        console.error('API: getCode error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { saveCode, getCode, createRoom, checkRoom };

// module.exports = { saveCode, getCode };
