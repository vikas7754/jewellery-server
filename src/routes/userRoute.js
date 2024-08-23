const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/me", userController.me);

module.exports = router;
