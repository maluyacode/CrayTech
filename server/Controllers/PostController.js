const Comment = require('../Models/Comment');
const Post = require('../Models/Post');
const { uploadMultiple } = require('../Utils/ImageFile');

const errorHandler = ({ error, response, status = 500 }) => {
    console.log(error)
    return response.status(status).json({
        success: false,
        message: error?.response?.data?.message || 'System error, please try again later'
    })
}

exports.create = async (req, res, next) => {
    try {

        if (req.files?.videos) {
            req.body.videos = await uploadMultiple({ mediaFiles: req.files?.videos });
        }

        if (req.files?.images) {
            req.body.images = await uploadMultiple({ mediaFiles: req.files?.images });
        }

        if (req.body.poll) {
            req.body.poll = JSON.parse(req.body.poll);
        }
        console.log(req.body)
        req.body.author = req.user._id;

        const post = await Post.create(req.body);

        return res.json({
            message: "Posted",
            success: true,
            post: post,
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }
}

exports.getPosts = async (req, res, next) => {
    try {

        let posts = await Post.find()
            .populate("community")
            .populate('author');

        console.log(posts[0]);

        return res.json({
            message: "Posts available",
            success: true,
            posts: posts,
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }
}

exports.upvote = async (req, res, next) => {
    try {

        const post = await Post.findById(req.params.id)
            .populate("community")
            .populate('author');
        const userId = req.body.user_id

        console.log(userId)

        if (post.upvotes.includes(userId)) {
            post.upvotes.pop(userId)
        } else {
            post.upvotes.push(userId)
            post.downvotes.pop(userId);
        }

        post.save()

        return res.json({
            message: "Upvoted!",
            success: true,
            post,
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }
}

exports.downvote = async (req, res, next) => {
    try {

        const post = await Post.findById(req.params.id)
            .populate("community")
            .populate('author');
        const userId = req.body.user_id

        console.log(userId)

        if (post.downvotes.includes(userId)) {
            post.downvotes.pop(userId)
        } else {
            post.downvotes.push(userId)
            post.upvotes.pop(userId);
        }

        post.save()

        return res.json({
            message: "Downvoted!",
            success: true,
            post
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }
}


exports.getPost = async (req, res, next) => {
    try {

        const post = await Post.findById(req.params.id)
            .populate("community")
            .populate('author');

        const comments = await Comment.find({ replied_to: post._id });

        return res.json({
            message: "Post fetched!",
            success: true,
            post,
            comments,
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }
}