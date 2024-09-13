const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/me", userController.me);
router.get("/get-users", userController.getUsers);

module.exports = router;
