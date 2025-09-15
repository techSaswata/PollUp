const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const pollsRouter = require('./routes/polls');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/polls', pollsRouter);

app.get('/', (req, res) => {
	return res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			serverSelectionTimeoutMS: 5000,
		});
		console.log('Connected to MongoDB');
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error('Failed to connect to MongoDB', err);
		process.exit(1);
	}
}

start();
