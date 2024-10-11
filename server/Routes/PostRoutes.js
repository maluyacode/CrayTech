const express = require("express");
const router = express.Router();
const upload = require("../Utils/multer");
const { isAuthenticated } = require("../Middleware/Auth");
const postController = require('../Controllers/PostController');

router.post("/post/create",
    isAuthenticated,
    upload.fields([
        { name: 'videos' },
        { name: 'images' },
    ]),
    postController.create
);

module.exports = router;