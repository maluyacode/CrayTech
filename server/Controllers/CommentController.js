const Comment = require('../Models/Comment');
const notify = require('../Utils/notify');

const errorHandler = ({ error, response, status = 500 }) => {
    console.log(error)
    return response.status(status).json({
        success: false,
        message: error?.response?.data?.message || 'System error, please try again later'
    })
}

exports.createComment = async (req, res, next) => {
    try {


        const comment = await Comment.create(req.body);

        const repliedComment = await Comment.findById(req.body.replied_to);

        if (repliedComment) {
            repliedComment.replies.push(comment._id);
            await repliedComment.save();
        }

        let comments = await Comment.find({ replied_to: repliedComment?.post, })
            .sort({ createdAt: -1 })

        if (!repliedComment) {
            comments = await Comment.find({ replied_to: req.body.post, })
                .sort({ createdAt: -1 })
        }


        if (comment.replied_to.toString() === comment.post.toString()) {

            let commentData = await comment.populate({
                path: 'post',
                populate: {
                    path: 'author'
                }
            });

            const author = commentData.post.author;
            const post = commentData.post;

            if (author.profile.preferences.notifications.comments) {
                notify.sendMessage({
                    title: `${req.user.username} commented on your post`,
                    body: comment.text_content,
                    subtitle: 'Comment',
                    user: req.user,
                    tokens: [author.notificationToken]
                });
            }

        } else {

            let commentData = await comment.populate({
                path: 'replied_to',
                model: 'comment',
                populate: {
                    path: 'commented_by'
                }
            });


            const author = commentData.replied_to.commented_by;
            const textContent = commentData.text_content;
            console.log(author)
            if (author.profile.preferences.notifications.replies) {
                notify.sendMessage({
                    title: `${req.user.username} replied to your comment`,
                    body: textContent,
                    subtitle: 'Reply',
                    user: req.user,
                    tokens: [author.notificationToken]
                });
            }


        }


        return res.json({
            message: "Comment posted!",
            success: true,
            comment,
            latestComments: comments
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }
}

exports.getAllComments = async (req, res, next) => {

    try {

        return res.json({
            message: "Comment posted!",
            success: true,
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }

}

exports.upvoteComment = async (req, res, next) => {

    try {

        const comment = await Comment.findById(req.params.id);
        const { userId } = req.body;

        if (comment.upvotes.includes(userId)) {
            // Remove userId from upvotes if it exists
            comment.upvotes = comment.upvotes.filter(vote => vote.toString() !== userId);

            console.log(comment.upvotes);
        } else {
            // Add userId to upvotes if it doesn't exist
            comment.upvotes.push(userId);

            // Also remove userId from downvotes if it exists
            comment.downvotes = comment.downvotes.filter(vote => vote.toString() !== userId);
        }

        // Save the updated comment
        await comment.save();


        return res.json({
            message: "Comment upvoted!",
            success: true,
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }

}

exports.downvoteComment = async (req, res, next) => {

    try {

        const comment = await Comment.findById(req.params.id);
        const { userId } = req.body;

        if (comment.downvotes.includes(userId)) {
            // Remove `userId` from `downvotes` using `filter`
            comment.downvotes = comment.downvotes.filter(vote => vote.toString() !== userId);
        } else {
            // Add `userId` to `downvotes`
            comment.downvotes.push(userId);

            // Remove `userId` from `upvotes` if it exists
            comment.upvotes = comment.upvotes.filter(vote => vote.toString() !== userId);
        }

        // Save the updated comment
        await comment.save();


        return res.json({
            message: "Comment downvoted!",
            success: true,
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }

}

exports.postComments = async (req, res, next) => {
    try {

        let query = {}
        if (req.params.id !== "undefined") {
            query = {
                post: req.params.id
            }
        }

        const comments = await Comment.find(query);

        return res.json({
            message: "All comments!",
            success: true,
            commentsCount: comments.length
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }
}

exports.deleteComment = async (req, res, next) => {
    try {

        const comment = await Comment.findById(req.params.id);

        comment.delete(req.user._id);

        Comment.delete({ replied_to: req.params.id }).exec()

        return res.json({
            message: "Comment delete!",
            success: true,
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }
}