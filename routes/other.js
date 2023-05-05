var express = require("express");
var router = express.Router();
var multer = require("multer");
const upload = multer();
var Other = require("../models/other");
var { wrapAsync } = require("../helper/catchHandler");

const type = upload.none();

//routes
router.post(
  "/",
  type,
  wrapAsync(async (req, res) => {
    if (!req.body.image) {
      return res.status(400).json({
        status: "fail",
        data: { image: "No image selected" },
      });
    }
    const otherDetails = {
      title: req.body.title,
      image: req.body.image,
    };
    const others = new Other(otherDetails);
    const result = await others.save();
    return res.status(200).json(result);
  })
);

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const others = await Other.find();
    return res.json(others);
  })
);

router.patch(
  "/:id",
  type,
  wrapAsync(async (req, res) => {
    const otherId = req.params.id;
    const other = await Other.findById(otherId);
    if (!other) {
      return res.status(404).json({
        message: "Other service not found",
      });
    }
    if (req.body.image) {
      other.image = req.body.image;
    }
    Object.assign(other, req.body);
    await other.save();
    return res.json(other);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const otherId = req.params.id;
    const other = await Other.findById(otherId);
    if (!other) {
      return res.status(404).json({
        message: "Other service not found",
      });
    }
    await Other.deleteOne({ _id: otherId });
    return res.json({ status: "sucess", message: "Other service deleted" });
  })
);

module.exports = router;
