const express = require("express");
const router = express.Router();
const upload = require("../Utils/multer");
const communityController = require('../Controllers/CommunityController');
const { isAuthenticated } = require("../Middleware/Auth");

router.post('/community/create',
    isAuthenticated,
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
    ]),
    communityController.createCommunity
);

router.get('/community/:id', isAuthenticated, communityController.getCommunity);

router.get('/communities', isAuthenticated, communityController.getCommunities);

router.put('/community/update/:id',
    isAuthenticated,
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
    ]),
    communityController.updateCommunity
)

module.exports = router;