const express = require('express');
const AuthorModel = require('../models/author');

const router = express.Router();

// Get all authors
router.get('/', async (req, res) => {
    try {
        const authors = await AuthorModel.find();
        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single author
router.get('/:id', getAuthor, (req, res) => {
    res.json(res.author);
});

// Create an author
router.post('/', async (req, res) => {
    try {
        // Validate request body
        const { name, age } = req.body;
        if (!name || !age) {
            return res.status(400).json({ message: 'Name and age are required' });
        }

        // Check if the author's name already exists
        const existingAuthor = await AuthorModel.findOne({ name });
        if (existingAuthor) {
            return res.status(400).json({ message: 'Author already exists' });
        }

        const author = new AuthorModel({ name, age });
        const newAuthor = await author.save();
        res.status(201).json({ message: 'Author created successfully', author: newAuthor });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an author
router.patch('/:id', getAuthor, async (req, res) => {
    try {
        const { name } = req.body;
        if (name != null) {
            res.author.name = name;
        }
        const updatedAuthor = await res.author.save();
        res.json(updatedAuthor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Replace an author
router.put('/:id', getAuthor, async (req, res) => {
    try {
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedAuthor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an author
router.delete('/:id', getAuthor, async (req, res) => {
    try {
        await AuthorModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Author deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a single author by ID
async function getAuthor(req, res, next) {
    try {
        const author = await AuthorModel.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.author = author;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = router;
