const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const db = require('../utils/db');

// @route   POST api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let admin = db.findOne('admins', { email });
        if (!admin) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { admin: { id: admin.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/register
// @desc    Register new admin (public so first admin can be created)
// @access  Public
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        let existing = db.findOne('admins', { email });
        if (existing) return res.status(400).json({ msg: 'An admin with this email already exists.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = db.insert('admins', { email, password: hashedPassword, name: name || email.split('@')[0] });
        res.json({ msg: 'Admin account created successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/admins
// @desc    Get all admins (excluding passwords)
// @access  Private
router.get('/admins', auth, async (req, res) => {
    try {
        const admins = db.get('admins').map(a => ({
            id: a.id,
            _id: a._id,
            email: a.email,
            name: a.name,
            createdAt: a.createdAt
        }));
        res.json(admins);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/auth/admins/:id
// @desc    Delete an admin account
// @access  Private
router.delete('/admins/:id', auth, async (req, res) => {
    try {
        // Prevent deleting yourself
        const token = req.header('Authorization').slice(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const requestingAdmin = db.findOne('admins', { id: decoded.admin.id });
        const targetAdmin = db.findOne('admins', { _id: req.params.id });

        if (!targetAdmin) return res.status(404).json({ msg: 'Admin not found' });
        if (requestingAdmin && (requestingAdmin.id === targetAdmin.id || requestingAdmin._id === targetAdmin._id)) {
            return res.status(400).json({ msg: 'You cannot delete your own account while logged in.' });
        }

        // Prevent deleting the last admin
        const allAdmins = db.get('admins');
        if (allAdmins.length <= 1) {
            return res.status(400).json({ msg: 'Cannot delete the last admin account.' });
        }

        db.deleteById('admins', req.params.id);
        res.json({ msg: 'Admin removed successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
