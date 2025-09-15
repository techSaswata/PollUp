const express = require('express');
const mongoose = require('mongoose');
const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

const router = express.Router();

function toApiPoll(doc) {
	return {
		id: String(doc._id),
		question: doc.question,
		options: doc.options.map(o => ({ text: o.text, votes: o.votes })),
		createdAt: doc.createdAt,
	};
}

// POST /polls
router.post('/', async (req, res) => {
	try {
		const { question, options } = req.body || {};
		if (!question || !Array.isArray(options) || options.length < 2) {
			return res.status(400).json({ error: 'Provide question and at least two options' });
		}
		const optionDocs = options.map(text => ({ text: String(text), votes: 0 }));
		const poll = await Poll.create({ question: String(question), options: optionDocs });
		return res.status(201).json(toApiPoll(poll));
	} catch (err) {
		console.error('Error creating poll', err);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

// GET /polls
router.get('/', async (req, res) => {
	try {
		const polls = await Poll.find({}).sort({ createdAt: -1 }).lean();
		return res.json(
			polls.map(p => ({
				id: String(p._id),
				question: p.question,
				options: p.options.map(o => ({ text: o.text, votes: o.votes })),
				createdAt: p.createdAt,
			}))
		);
	} catch (err) {
		console.error('Error fetching polls', err);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

// POST /polls/:id/vote
router.post('/:id/vote', async (req, res) => {
	try {
		const { id } = req.params;
		const { optionIndex } = req.body || {};
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Invalid poll id' });
		}
		if (typeof optionIndex !== 'number' || optionIndex < 0) {
			return res.status(400).json({ error: 'optionIndex must be a non-negative number' });
		}

		const poll = await Poll.findOneAndUpdate(
			{ _id: id, [`options.${optionIndex}`]: { $exists: true } },
			{ $inc: { [`options.${optionIndex}.votes`]: 1 } },
			{ new: true }
		);

		if (!poll) {
			return res.status(404).json({ error: 'Poll or option not found' });
		}

		await Vote.create({ pollId: poll._id, optionIndex });

		return res.json(toApiPoll(poll));
	} catch (err) {
		console.error('Error voting on poll', err);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;
