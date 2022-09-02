var express = require("express");
var router = express.Router();
var { wrapAsync } = require("../helper/catchHandler");
var descsController = require("../controllers/homeDesc");

//routes
router.post("/", wrapAsync(descsController.postHomeDesc));

router.get("/", wrapAsync(descsController.getallDescs));

router.patch("/:id", wrapAsync(descsController.updateDescs));

router.delete("/:id", wrapAsync(descsController.deleteDesc));

module.exports = router;
