const router = require("express").Router();
const enquiryController = require("../controllers/enquiryController");

router.post("/", enquiryController.addEnquiry);

module.exports = router;
