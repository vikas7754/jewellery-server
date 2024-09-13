const signupMail = require("../emails/emails/signup-email");
const User = require("../models/user");
const XLSX = require("xlsx");

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

const getUsers = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const users = await User.find({ role: "user" }).skip(skip).limit(limit);
    const total = await User.countDocuments({ role: "user" });
    return res.status(200).json({ users, total });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const exportUsers = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const query = { role: "user" };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const users = await User.find(query);

    const data = users.map((user) => {
      return {
        Name: user.name,
        Email: user.email,
        Mobile: user.mobile,
        Address: user.details?.address || "NA",
        City: user.details?.city || "NA",
        State: user.details?.state || "NA",
      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader("Content-Disposition", 'attachment; filename="users.xlsx"');
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { login, me, logout, signup, getUsers, exportUsers };
