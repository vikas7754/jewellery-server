const queryMail = require("../emails/emails/query-email");
const Enquiry = require("../models/enquiry");

const addEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    queryMail(enquiry);
    return res.status(201).json({ message: "Enquiry added successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addEnquiry };
