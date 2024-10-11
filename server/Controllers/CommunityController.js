const Community = require("../Models/Community")
const { uploadSingle } = require("../Utils/ImageFile")


const errorHandler = ({ error, response, status = 500 }) => {
    console.log(error)
    return response.status(status).json({
        success: false,
        message: error?.response?.data?.message || 'System error, please try again later'
    })
}

exports.createCommunity = async (req, res, next) => {
    try {

        // console.log(req.body)
        // console.log(req.files);

        // return res.json({ message: "Asdsad" });

        if (req.files) {

            req.body.banner = await uploadSingle({
                imageFile: req.files.banner[0].path,
                request: req,
            })

            req.body.avatar = await uploadSingle({
                imageFile: req.files.avatar[0].path,
                request: req,
            })

        }

        req.body.topics = req.body.topics.split(",");
        req.body.created_by = req.user._id
        req.body.members = []
        req.body.members.push({
            _id: req.user._id,
            role: 'moderator',
        })

        const community = await Community.create(req.body);

        res.json({
            success: true,
            message: 'Community created successfully',
            community: community
        })

    } catch (err) {
        console.log(err);
        errorHandler({ error: err, response: res })
    }
}
exports.getCommunity = async (req, res, next) => {

    try {

        console.log(req.params)

        const community = await Community.findById(req.params.id);

        res.json({
            success: true,
            community: community
        })

    } catch (err) {
        console.log(err);
        errorHandler({ error: err, response: res })
    }

}

exports.getCommunities = async (req, res, next) => {
    try {

        let filterOptions = {}

        if (req.query.filter) {
            filterOptions = {
                $or: [
                    { created_by: req.user._id },  // Check if the user is the creator
                    {
                        members: {
                            $elemMatch: { _id: req.user._id }  // Check if the user is a member
                        }
                    }
                ]
            };
        }

        const communities = await Community.find(filterOptions);

        console.log(communities);

        res.json({
            success: true,
            communities: communities
        })

    } catch (err) {
        console.log(err);
        errorHandler({ error: err, response: res })
    }
}

exports.updateCommunity = async (req, res, next) => { }
exports.deleteCommunity = async (req, res, next) => { }