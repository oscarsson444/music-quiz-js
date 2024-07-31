var { User } = require("../models/model");

const createUser = async (data) => {
  try {
    const email = data.email;
    const newUser = new User({ email: email });
    const newUserResp = await newUser.save();
    return { user: newUserResp };
  } catch (e) {
    console.log(e);
    throw new Error("User can not be created!");
  }
};

const getUser = async (email) => {
  const user = await User.findOne({ email: email });
  return { user: user };
};

module.exports = { createUser, getUser };
