const signupMail = require("../emails/emails/signup-email");
const User = require("../models/user");

const generatePassword = require("../utils/generatePassword");

const signup = async (req, res) => {
  try {
    const { name, email, mobile, address, city, state } = req.body;
    if (!name || !email || !mobile || !address)
      return res.status(400).json({ message: "All fields are required!" });

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist)
      return res.status(400).json({ message: "Email already exist!" });
    const isMobileExist = await User.findOne({ mobile });
    if (isMobileExist)
      return res.status(400).json({ message: "Mobile already exist!" });

    const password = generatePassword();
    const user = new User({
      name,
      email,
      mobile,
      password,
      details: { address, city, state },
    });
    await user.save();

    signupMail({ name, email, mobile, password });

    const token = await user.generateToken();
    return res.cookie("auth", token).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const isMatch = await user.comparepassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password!" });
    const token = await user.generateToken();
    return res.cookie("auth", token).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    let token = req.cookies.auth;
    if (!token) return res.status(400).json({ message: "User not found!" });

    const user = await User.findByToken(token);
    if (!user) return res.status(400).json({ message: "User not found!" });

    if (!(await user.deleteToken(token)))
      return res.status(400).json({ message: "Something went wrong!" });
    res.clearCookie("auth");
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const me = async (req, res) => {
  try {
    let token = req.cookies.auth;
    if (!token) return res.status(200).json({});
    const userDetail = await User.findByToken(token);
    if (!userDetail) return res.status(200).json({});
    return res.status(200).json(userDetail);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { login, me, logout, signup };
