const router = require("express").Router();

const IndexController = require("../controllers/index.js");

router.get("/", IndexController.index);

// router.get("/test", IndexController.test);

module.exports = router;
