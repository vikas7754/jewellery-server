const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/me", userController.me);

module.exports = router;
