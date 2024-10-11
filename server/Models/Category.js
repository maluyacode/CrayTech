const mongoose = require('mongoose');
// const Populate = require("mongoose-autopopulate");
const mongooseDelete = require("mongoose-delete");

const categoryModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
}, { timestamps: true });


// categoryModel.plugin(Populate);
categoryModel.plugin(mongooseDelete, { overrideMethods: 'all' })

module.exports = mongoose.model('Category', categoryModel);