const router = require("express").Router();
const rateController = require("../controllers/rateController");

router.get("/", rateController.getAllData);
router.post("/", rateController.addRate);
router.put("/:id", rateController.updateRate);
router.delete("/:id", rateController.deleteRate);
router.get("/:name", rateController.getRateByName);

module.exports = router;
