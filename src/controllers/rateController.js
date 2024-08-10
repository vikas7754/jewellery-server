const Rate = require("../models/rate");
const axios = require("axios");

const getAllData = async (req, res) => {
  const headers = {
    "Content-Type": "*/*",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
  };

  try {
    const rates = await Rate.find();

    const { data: sellingPrice } = await axios.get(
      "https://data-asg.goldprice.org/dbXRates/INR",
      { headers }
    );

    const ounce = 31.1034768;
    const price = sellingPrice?.items[0];

    const goldPrice = (price?.xauPrice * 10) / ounce || 0;
    const silverPrice = (price?.xagPrice * 1000) / ounce || 0;
    const productTable = [
      ["Gold 99.50", Math.ceil(goldPrice)],
      ["Silver 99.99", Math.ceil(silverPrice)],
    ];

    const futureTable = [
      ["Gold", "62275", "62287", "62400 / 62200"],
      ["Silver", "72038", "72050", "72100 / 71900"],
      ["Gold Next", "62275", "62287", "62400 / 62200"],
      ["Silver Next", "72038", "72050", "72100 / 71900"],
    ];

    const goldSpot = {
      spot: "Gold $",
      bid: "62275",
      ask: "62287",
      high: "62400",
      low: "62200",
      bid_growth: "up",
      ask_growth: "down",
    };

    const silverSpot = {
      spot: "Silver $",
      bid: "72038",
      ask: "72050",
      high: "72100",
      low: "71900",
      bid_growth: "down",
      ask_growth: "up",
    };

    const inrSpot = {
      spot: "INR $",
      bid: "62275",
      ask: "62287",
      high: "62400",
      low: "62200",
    };

    const spotTable = {
      goldSpot,
      silverSpot,
      inrSpot,
    };

    const result = {
      productTable,
      futureTable,
      spotTable,
    };

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addRate = async (req, res) => {
  try {
    const { product, amount, category } = req.body;
    const rate = new Rate({ product, amount, category });
    await rate.save();
    return res.status(201).json(rate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateRate = async (req, res) => {
  try {
    const { product, amount, category } = req.body;
    const { id } = req.params;
    const rate = await Rate.findByIdAndUpdate(
      id,
      { product, amount, category },
      { new: true }
    );
    return res.status(200).json(rate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteRate = async (req, res) => {
  try {
    const { id } = req.params;
    await Rate.findByIdAndDelete(id);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getRateByName = async (req, res) => {
  try {
    const { name } = req.params;
    const rate = await Rate.findOne({ product: name });
    return res.status(200).json(rate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllData,
  addRate,
  updateRate,
  deleteRate,
  getRateByName,
};
