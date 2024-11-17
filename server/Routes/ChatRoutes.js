const express = require("express");
const router = express.Router();
const { isAuthenticated, isAuthorized } = require('../Middleware/Auth')

const chatController = require('../Controllers/ChatController')

router.post('/message/send', isAuthenticated, chatController.sendMessage);

router.get('/chats/:id', isAuthenticated, chatController.getChats)

router.get('/chat/:id', isAuthenticated, chatController.getChat)

module.exports = router;