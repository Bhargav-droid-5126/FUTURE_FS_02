const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../utils/db');

// @route   POST api/leads
// @desc    Create lead
// @access  Public (from website) or Private (manual entry)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, company, message, source, status, notes } = req.body;

        const newLead = {
            name,
            email,
            phone: phone || '',
            company: company || '',
            message: message || '',
            source: source || 'Website Contact Form',
            status: status || 'New',
            notes: notes ? [{ text: notes, date: new Date().toISOString() }] : []
        };

        const lead = db.insert('leads', newLead);
        res.json(lead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/leads
// @desc    Get all leads
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let leads = db.get('leads');
        // sort descending by date
        leads = leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(leads);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/leads/:id
// @desc    Get single lead
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const lead = db.findOne('leads', { _id: req.params.id });
        if (!lead) return res.status(404).json({ msg: 'Lead not found' });
        res.json(lead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/leads/:id
// @desc    Update lead
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, email, phone, company, message, source, status } = req.body;

    const leadFields = {};
    if (name !== undefined) leadFields.name = name;
    if (email !== undefined) leadFields.email = email;
    if (phone !== undefined) leadFields.phone = phone;
    if (company !== undefined) leadFields.company = company;
    if (message !== undefined) leadFields.message = message;
    if (source !== undefined) leadFields.source = source;
    if (status !== undefined) leadFields.status = status;

    try {
        const lead = db.updateById('leads', req.params.id, leadFields);
        if (!lead) return res.status(404).json({ msg: 'Lead not found' });
        res.json(lead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/leads/:id
// @desc    Delete lead
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const success = db.deleteById('leads', req.params.id);
        if (!success) return res.status(404).json({ msg: 'Lead not found' });

        res.json({ msg: 'Lead removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/leads/:id/notes
// @desc    Add note
// @access  Private
router.post('/:id/notes', auth, async (req, res) => {
    try {
        let lead = db.findOne('leads', { _id: req.params.id });
        if (!lead) return res.status(404).json({ msg: 'Lead not found' });

        const newNote = {
            text: req.body.text,
            date: new Date().toISOString()
        };

        // Add to top of notes
        const updatedNotes = [newNote, ...(lead.notes || [])];

        lead = db.updateById('leads', req.params.id, { notes: updatedNotes });

        res.json(lead.notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
