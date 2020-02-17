const express = require('express');
const router = express.Router();

// GET all bootcamps
router.get('/', (req, res) => {
	res.status(200).json({ success: true, msg: `This will show all bootcamps.` });
});

// GET a specific bootcamp by id
router.get('/:id', (req, res) => {
	res
		.status(200)
		.json({ success: true, msg: `This will show Bootcamp #${req.params.id}` });
});

// POST to create new bootcamp
router.post('/', (req, res) => {
	res.status(200).json({ success: true, msg: `Created a new bootcamp!` });
});

// PUT to update existing bootcamp
router.put('/:id', res => {
	res
		.status(200)
		.json({ success: true, msg: `Updated Bootcamp #${req.params.id}` });
});

// DELETE a bootcamp
router.delete('/:id', (req, res) => {
	res
		.status(200)
		.json({ success: true, msg: `Deleted Bootcamp #${req.params.id}!` });
});

module.exports = router;
