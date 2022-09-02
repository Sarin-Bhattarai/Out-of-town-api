var express = require("express");
var router = express.Router();
var { wrapAsync } = require("../helper/catchHandler");
var faqController = require("../controllers/faq");

//routes
router.post("/", wrapAsync(faqController.postFaq));

router.get("/", wrapAsync(faqController.getallFaqs));

router.patch("/:id", wrapAsync(faqController.updateFaq));

router.delete("/:id", wrapAsync(faqController.deleteFaq));

module.exports = router;
