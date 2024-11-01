const Comment = require('../Models/Comment');

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

        console.log(repliedComment);

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

        console.log(comments);

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