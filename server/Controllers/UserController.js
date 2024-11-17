const User = require("../Models/User");
const { uploadSingle } = require("../Utils/ImageFile");
const sendToken = require("../Utils/jwtToken");
const { generateFromEmail } = require("unique-username-generator");


const errorHandler = ({ error, response, status = 500 }) => {
  console.log(error)
  return response.status(status).json({
    success: false,
    message: error?.response?.data?.message || 'System error, please try again later'
  })

}

exports.register = async (req, res, next) => {
  try {

    req.body.username = generateFromEmail(
      req.body.email,
      3
    );

    const user = await User.create(req.body);

    if (!user) {
      return res.status(400).send("the user cannot be created!");
    }

    return sendToken(user, 200, res, "Success");

  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "Please try again later",
      success: false,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email & password" });
    }

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const passwordMatched = await user.comparePassword(password);

    if (!passwordMatched) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    user = await User.findOne(user._id);

    sendToken(user, 200, res, "Successfully Login");
  } catch (err) {
    return res.status(400).json({
      message: "Please try again later",
      success: false,
    });
  }
};

exports.update = async (req, res, next) => {

  try {
    console.log(req.body);
    if (req.file) {

      req.body = {
        ...req.body,
        $set: {
          "profile.avatar": await uploadSingle({
            imageFile: req.file.path,
            request: req,
          })
        }
      }
    } else {
      delete req.body?.avatar
    }

    if (req.body.preferences) {
      req.body = {
        ...req.body,
        $set: {
          "profile.preferences": JSON.parse(req.body.preferences),
        }
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });

    console.log(user)

    return res.status(200).json({
      success: true,
      user: user,
    })

  } catch (err) {
    console.log(err)
    errorHandler({ error: err, response: res })
  }
};

exports.allUsers = async (req, res, next) => {
  try {

    let query = { _id: { $ne: req.user._id } };

    if (req.query.keyword) {
      const keyword = req.query.keyword;
      query.username = { $regex: new RegExp(keyword, "i") };
    }

    const users = await User.find(query);

    return res.status(200).json({
      success: true,
      users: users,
    })

  } catch (err) {
    console.log(err)
    errorHandler({ error: err, response: res })
  }
}

exports.notificationToken = async (req, res, next) => {
  try {

    const user = await User.findById(req.params.id);

    user.notificationToken = req.body.notificationToken
    user.save();

    return res.send({
      message: 'Token recieve',
      success: true,
    })

  } catch (err) {
    console.log(err)
    errorHandler({ error: err, response: res })
  }
}