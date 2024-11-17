const Comment = require('../Models/Comment');
const Post = require('../Models/Post');
const { uploadMultiple } = require('../Utils/ImageFile');
const mongoose = require('mongoose')
const notify = require('../Utils/notify');

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

        let post = await Post.create(req.body);

        post = await post.populate([
            {
                path: 'community',
                populate: [
                    {
                        path: 'banned_users',
                        model: 'User',
                    },
                    {
                        path: 'members._id',
                        model: 'User'
                    }
                ],
            },
            {
                path: 'author',
                model: 'User'
            }
        ])

        const community = post.community;
        let members = post.community.members.map(member => member._id)
        const banned_users = post.community.banned_users.map(user => user._id.toString());
        const author = post.author;


        members = members
            .filter(member => !banned_users.includes(member._id.toString()))
            .filter(member => member._id.toString() !== author._id.toString());

        console.log(members)

        receiversToken = members
            .filter(user => user._id.toString() !== req.user._id.toString())
            .filter(user => user.profile.preferences.notifications.communityUpdates === true)
            .map(user => user.notificationToken)
            .filter(token => token)


        receiversToken = [...new Set(receiversToken)]
        
        console.log(receiversToken);

        notify.sendMessage({
            title: community.name,
            body: post.title,
            subtitle: 'Community',
            user: req.user,
            tokens: receiversToken.length <= 0 ? ['requirestokenkase'] : receiversToken
        });

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

        let query = {};

        if (req.query.keyword) {
            const keyword = req.query.keyword;
            query.title = { $regex: new RegExp(keyword, "i") };
        }

        if (req.query?.category_filter && JSON.parse(req.query?.category_filter)?.length > 0) {
            console.log("asd")
            const categoryFilter = JSON.parse(req.query.category_filter).map(id => new mongoose.Types.ObjectId(id))

            const filteredPostsByCategory = await Post.aggregate([
                {
                    $lookup: {
                        from: 'communities',
                        localField: 'community',
                        foreignField: '_id',
                        as: 'communityInfo',
                    }
                },
                { $unwind: "$communityInfo" },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'userInfo',
                    }
                },
                { $unwind: "$userInfo" },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                "$$ROOT", // the original document
                                { community: "$communityInfo" },
                                { author: "$userInfo" },
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'communityInfo.topics',
                        foreignField: '_id',
                        as: 'topicsInfo'
                    }
                },
                { $unwind: "$topicsInfo" },
                { $match: { "topicsInfo._id": { $in: categoryFilter } } },
            ]);

            return res.json({
                message: "Posts available",
                success: true,
                posts: filteredPostsByCategory,
            })
        }

        if (req.query.filter_type?.toLowerCase() === 'recommended') {
            console.log(req.query.filter_type)
            // const filterType = req.query.filter_type
            const recommended = await Post.aggregate([
                {
                    $lookup: {
                        from: 'communities',
                        localField: 'community',
                        foreignField: '_id',
                        as: 'communityInfo',
                    }
                },
                { $unwind: "$communityInfo" },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'userInfo',
                    }
                },
                { $unwind: "$userInfo" },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                "$$ROOT", // the original document
                                { community: "$communityInfo" },
                                { author: "$userInfo" },
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'communityInfo.topics',
                        foreignField: '_id',
                        as: 'topicsInfo'
                    }
                },
                { $unwind: "$topicsInfo" },
                { $match: { "topicsInfo._id": { $in: req.user.topics } } },
            ]);

            return res.json({
                message: "Posts available",
                success: true,
                posts: recommended,
            })

        }

        if (req.query.filter_type?.toLowerCase() === 'latest') {
            const posts = await Post.find()
                .populate("community")
                .populate('author')
                .sort({ createdAt: -1 });
            return res.json({
                message: "Posts available",
                success: true,
                posts: posts,
            })
        }

        if (req.query.filter_type?.toLowerCase() === 'trending') {

            const trendingPosts = await Post.aggregate([
                {
                    $lookup: {
                        from: 'communities',
                        localField: 'community',
                        foreignField: '_id',
                        as: 'communityInfo',
                    }
                },
                { $unwind: "$communityInfo" },
                { $unwind: "$communityInfo" },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'userInfo',
                    }
                },
                { $unwind: "$userInfo" },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                "$$ROOT", // the original document
                                { community: "$communityInfo" },
                                { author: "$userInfo" },
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        upvoteCount: { $size: "$upvotes" },       // Count upvotes
                        downvoteCount: { $size: "$downvotes" },   // Count downvotes
                        commentCount: { $size: "$comments" }      // Count comments
                    }
                },
                {
                    $addFields: {
                        trendinessScore: {
                            $add: [
                                { $subtract: ["$upvoteCount", "$downvoteCount"] }, // Net upvotes (upvotes - downvotes)
                                "$commentCount"                                    // Add comments count
                            ]
                        }
                    }
                },
                {
                    $sort: { trendinessScore: -1 } // Sort posts by trendiness score in descending order
                },
            ])
            return res.json({
                message: "Posts available",
                success: true,
                posts: trendingPosts,
            })
        }

        if (req.query.filter_type?.toLowerCase() === 'my-post') {
            query = {
                author: req.user._id
            }
        }

        let posts = await Post.find(query)
            .populate("community")
            .populate('author');

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
        const allComments = await Comment.find({ post: post._id });

        return res.json({
            message: "Post fetched!",
            success: true,
            post,
            comments,
            commentsCount: allComments.length
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }
}

exports.update = async (req, res, next) => {
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

        if (req.body.post_type !== 'poll') {
            req.body.poll = [];
        }

        if (req.body.post_type === 'image') {
            if (typeof req.body.images === 'string') {
                req.body.images = JSON.parse(req.body.images);
            }
            delete req.body.videos
        }

        if (req.body.post_type === 'video') {
            if (typeof req.body.videos === 'string') {
                req.body.videos = JSON.parse(req.body.videos);
            }
            delete req.body.images
        }

        if (req.body.post_type === 'null' || req.body.post_type === 'poll') {
            req.body.videos = JSON.parse(req.body.videos);
            req.body.images = JSON.parse(req.body.images);
            delete req.body.post_type;
        }

        console.log(req.body);

        const post = await Post.findByIdAndUpdate(req.params.id, req.body);

        return res.json({
            message: "Posted",
            success: true,
            post: post,
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }
}

exports.delete = async (req, res, next) => {
    try {

        const post = await Post.findById(req.params.id);

        post.delete(req.user._id);

        return res.json({
            message: "Post deleted!",
            success: true,
        })

    } catch (err) {
        errorHandler({ error: err, response: res })
    }
}