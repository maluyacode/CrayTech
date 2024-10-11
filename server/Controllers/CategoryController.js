const Category = require("../Models/Category")

const errorHandler = ({ error, response, status = 500 }) => {
    console.log(error)
    return response.status(status).json({
        success: false,
        message: error?.response?.data?.message || 'System error, please try again later'
    })
}

exports.create = async (req, res, next) => {
    try {

        const categories = await Category.create(req.body);

        return res.json({
            message: "Category created successfully",
            status: 201,
            categories: categories
        })

    } catch (err) {
        console.log(err);
        errorHandler({ error: err, response: res })
    }
}

exports.getAllCategories = async (req, res, next) => {
    try {

        const categories = await Category.find().select(["name", "_id"]);

        return res.json({
            message: "Categories available",
            status: 200,
            categories: categories
        })

    } catch (err) {
        console.log(err);
        errorHandler({ error: err, response: res })
    }
}