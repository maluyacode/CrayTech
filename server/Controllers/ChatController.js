const mongoose = require('mongoose');
const Chat = require('../Models/Chat')
const Message = require('../Models/Message');
const notify = require('../Utils/notify');

exports.sendMessage = async (req, res, next) => {

    try {

        let chat = await Chat.findById(req.body.chat_id);
        chat = await Chat.findOne({
            participants: { $all: req.body.participants }
        });

        if (!chat) {
            chat = await Chat.create(req.body);
        }

        req.body.chat = chat._id

        let message = await Message.create(req.body);

        chat.last_message = message._id;
        chat.last_message_delivered_at = Date.now()
        chat.save();

        message = await message.populate('sender');

        chat = await chat.populate('participants');

        const receivers = chat.participants
            .filter(user => user._id.toString() !== message.sender._id.toString())

        let receiversToken = receivers
            .filter(user => user._id.toString() !== req.user._id.toString())
            .filter(user => user.profile.preferences.notifications.messageNotify === true)
            .map(user => user.notificationToken);

        console.log(receiversToken)

        notify.sendMessage({
            body: message.text_content,
            title: message.sender.username,
            subtitle: 'Message',
            user: req.user,
            tokens: receiversToken.length <= 0 ? ['requirestokenkase'] : receiversToken
        });

        res.json({
            message: "Success",
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error occured",
        })
    }
}

exports.getChats = async (req, res, next) => {

    try {

        const chats = await Chat.find({
            participants: { $in: [req.params.id] }
        })
            .populate('last_message')
            .populate('participants')
            .sort({ last_message_delivered_at: -1 });

        res.json({
            message: "Success",
            chats: chats
        })

    } catch (error) {
        res.status(500).json({
            message: "Error occured",
        })
    }

}

exports.getChat = async (req, res, next) => {

    try {

        const chat = await Chat.findById(req.params.id)
            .populate('participants');

        const messages = await Message.find({ chat: chat._id })
            .populate('sender')
            .sort({ createdAt: - 1 });

        // console.log(chat)
        // console.log(messages);

        res.json({
            message: "Success",
            chat,
            messages
        })

    } catch (error) {
        res.status(500).json({
            message: "Error occured",
        })
    }

}