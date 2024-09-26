const Charges = require("../models/charge");

const addCharges = async (req, res) => {
  try {
    const charges = await Charges.findOne();
    if (charges) {
      await Charges.findByIdAndUpdate(charges._id, req.body);
    }
    const newCharges = new Charges(req.body);
    const savedCharges = await newCharges.save();
    return res.status(201).json(savedCharges);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getCharges = async (req, res) => {
  try {
    const charges = await Charges.findOne();
    if (!charges) {
      return res.status(404).json({ message: "Charges not found" });
    }
    return res.status(200).json(charges);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addCharges,
  getCharges,
};
