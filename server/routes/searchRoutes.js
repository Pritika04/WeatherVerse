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

router.post('/friends', authMiddleware, async (request, response) => {
    try {
        const userId = request.user.userId;
        const { friends } = request.body; 

        if (!Array.isArray(friends)) {
            return response.status(400).json({ message: 'Invalid friends format' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return response.status(404).json({ message: 'User not found!' });
        }

        for (const friend of friends) {
            const index = user.friends.findIndex(f => f.friendId.toString() === friend.friendId);

            if (index === -1) {
                // add new friend
                user.friends.push(friend);
            } else {
                if (friend.customName && user.friends[index].customName !== friend.customName) {
                    user.friends[index].customName = friend.customName;
                }
            }
            
        }

        await user.save(); 

        response.status(200).json({ 
            message: 'Friends updated successfully'
        });

    } catch (error) {
        console.error('Friends error:', error);
        response.status(500).json({ message: 'Server error' });
    }

}); 



module.exports = router;