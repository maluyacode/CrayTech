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