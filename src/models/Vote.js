const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema(
	{
		pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
		userId: { type: mongoose.Schema.Types.ObjectId, required: false },
		optionIndex: { type: Number, required: true, min: 0 },
		createdAt: { type: Date, default: Date.now },
	},
	{ versionKey: false }
);

module.exports = mongoose.model('Vote', VoteSchema);
