const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongooseDelete = require("mongoose-delete");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    profile: {
      avatar: {
        public_id: String,
        url: String,
      },  // 
      bio: { type: String },
      preferences: {
        theme: { type: String, enum: ["light", "dark"], default: "light" },
        notifications: {
          replies: { type: Boolean, default: true },
          comments: { type: Boolean, default: true },
          communityUpdates: { type: Boolean, default: true },
          messageNotify: { type: Boolean, default: true },
        },
        privacy: {
          showEmail: { type: Boolean, default: false },
        },
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    topics: [
      { type: mongoose.Schema.Types.ObjectId }
    ],
    joinedCommunities: [
      { type: mongoose.Schema.Types.ObjectId }
    ],
    notificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre(
  ["updateOne", "findByIdAndUpdate", "findOneAndUpdate"],
  async function (next) {
    const data = this.getUpdate();

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    next();
  }
);

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

userSchema.methods.comparePassword = async function (inputtedPassword) {
  return await bcrypt.compare(inputtedPassword, this.password);
};

userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

userSchema.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("User", userSchema);
