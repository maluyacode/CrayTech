const express = require("express");
const router = express.Router();
const URI = require("../Constants");
const upload = require("../Utils/multer");

const { isAuthenticated } = require('../Middleware/Auth')

const userController = require("../Controllers/UserController");

router.post(URI.REGISTER, upload.single("avatar"), userController.register);

router.post(URI.LOGIN, userController.login);

router.put(URI.UPDATE_PROFILE, upload.single("avatar"), userController.update);

router.get('/users/all', isAuthenticated, userController.allUsers);

router.post('/notification/token/:id', isAuthenticated, userController.notificationToken);

module.exports = router;
