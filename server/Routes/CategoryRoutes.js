const express = require("express");
const router = express.Router();
const categoryController = require("../Controllers/CategoryController")

router.post("/category/create", categoryController.create);

router.get("/categories", categoryController.getAllCategories)

module.exports = router;