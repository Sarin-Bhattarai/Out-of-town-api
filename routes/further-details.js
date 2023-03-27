var express = require("express");
var router = express.Router();
var { wrapAsync } = require("../helper/catchHandler");
var furtherDetailsController = require("../controllers/further-details");

//routes
router.post("/", wrapAsync(furtherDetailsController.postFurtherDetails));

router.get("/", wrapAsync(furtherDetailsController.getallFurtherDetails));

router.patch("/:id", wrapAsync(furtherDetailsController.updateFurtherDetails));

router.delete("/:id", wrapAsync(furtherDetailsController.deleteFurtherDetails));

module.exports = router;
