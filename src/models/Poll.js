const mongoose = require('mongoose');

const PollOptionSchema = new mongoose.Schema(
	{
		text: { type: String, required: true, trim: true },
		votes: { type: Number, required: true, default: 0, min: 0 },
	},
	{ _id: false }
);

const PollSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, required: false },
		question: { type: String, required: true, trim: true },
		options: { type: [PollOptionSchema], required: true, validate: v => Array.isArray(v) && v.length >= 2 },
		createdAt: { type: Date, default: Date.now },
	},
	{ versionKey: false }
);

module.exports = mongoose.model('Poll', PollSchema);
