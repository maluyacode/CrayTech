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

    const profile = {};

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
