const sendToken = (user, statuscode, res, message = "success") => {
  const token = user.getJwtToken();
  // const token = 'dummytoken'
  const options = {
    expires: false,
    httpOnly: false,
    maxAge: 5 * 60 * 1000,
  };
  res
    .status(statuscode)
    .clearCookie("token")
    .cookie("token", token, options)
    .cookie("user", JSON.stringify(user), options)
    .json({
      user,
      success: true,
      token,
      message,
    });
};

module.exports = sendToken;
