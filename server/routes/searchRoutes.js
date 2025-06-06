const express = require('express');
const router = express.Router();
const authMiddleware = require("../authMiddleware");

const User = require("../models/userModel"); 

router.get('/search', authMiddleware, async (request, response) => {
    const { query } = request.query; 

    if (!query || query.trim() === '') {
        return response.status(400).json({ message: 'Search query is required' });
    }

    try {
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('_id name email avatar');

        response.status(200).json({ users });
    } catch(error) {
        console.error('Search error:', error);
        response.status(500).json({ message: 'Server error while searching users' });
    }

}); 

module.exports = router;