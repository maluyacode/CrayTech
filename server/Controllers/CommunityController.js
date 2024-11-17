const Community = require("../Models/Community")
const Post = require("../Models/Post")
const { uploadSingle } = require("../Utils/ImageFile")
const mongoose = require('mongoose')

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

        const community = await Community.findById(req.params.id)
            .populate('banned_users')

        const members = await Community.aggregate([
            { $unwind: '$members' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members._id',
                    foreignField: '_id',
                    as: 'membersInfo'
                }
            },
            { $match: { "_id": new mongoose.Types.ObjectId(req.params.id) } },
            { $unwind: '$membersInfo' },
            {
                $project: {
                    "membersInfo": 1,
                    "members": 1,
                }
            }
        ])

        console.log(members);

        const posts = await Post.where("community", community._id)
            .populate("community")
            .populate('author');

        // console.log(community);

        res.json({
            success: true,
            community: community,
            members: members,
            posts,
        })

    } catch (err) {
        console.log(err);
        errorHandler({ error: err, response: res })
    }

}

exports.getCommunities = async (req, res, next) => {
    try {

        let filterOptions = {}

        if (req.query.filter === 'moderating') {
            filterOptions = {
                $or: [
                    { created_by: req.user._id },
                ]
            };
        }

        if (req.query.filter === 'joined') {
            filterOptions = {
                $or: [
                    { members: { $elemMatch: { _id: req.user._id, role: 'member' } } },
                ]
            }
        }

        if (req.query.filter === 'alljoined') {
            filterOptions = {
                $or: [
                    { members: { $elemMatch: { _id: req.user._id, role: 'member' } } },
                    { created_by: req.user._id },
                ]
            }
        }

        console.log(filterOptions.members);

        if (req.query.filter === 'others') {

            console.log('others');
            filterOptions = {
                members: {
                    $not: { $elemMatch: { _id: req.user._id } }
                }
            }
        }

        if (req.query.keyword) {
            const keyword = req.query.keyword;
            filterOptions.name = { $regex: new RegExp(keyword, "i") };
        }

        const communities = await Community.find(filterOptions);

        res.json({
            success: true,
            communities: communities
        })

    } catch (err) {
        console.log(err);
        errorHandler({ error: err, response: res })
    }
}

exports.updateCommunity = async (req, res, next) => {

    try {

        const community = await Community.findById(req.params.id);
        console.log(req.body);
        if (req.files) {

            if (req.files.banner) {
                req.body.banner = await uploadSingle({
                    imageFile: req.files.banner[0].path,
                    request: req,
                })
            }

            if (req.files.avatar) {
                req.body.avatar = await uploadSingle({
                    imageFile: req.files.avatar[0].path,
                    request: req,
                })
            }
        }


        if (req.body.members) {
            req.body.members = JSON.parse(req.body.members)
        } else {
            delete req.body.members;
        }

        if (req.body.banned_users) {
            req.body.banned_users = JSON.parse(req.body.banned_users)
        } else {
            delete req.body.banned_users;
        }
        // add other fields to be updated when needed

        const newCommunityData = {
            ...community.toObject(),
            ...req.body,
            // add other fields to be updated when needed
        }

        const updatedCommunity = await Community.findByIdAndUpdate(req.params.id, newCommunityData, { new: true });

        res.json({
            success: true,
            community: updatedCommunity,
        })

    } catch (err) {
        console.log(err);
        errorHandler({ error: err, response: res })
    }


}
exports.deleteCommunity = async (req, res, next) => { }