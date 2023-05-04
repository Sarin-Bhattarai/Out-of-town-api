var express = require("express");
var router = express.Router();
var multer = require("multer");
const upload = multer();
var Region = require("../models/region");
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
    const regionDetails = {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
    };
    const regions = new Region(regionDetails);
    const result = await regions.save();
    return res.status(200).json(result);
  })
);

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const regions = await Region.find();
    return res.json(regions);
  })
);

router.patch(
  "/:id",
  type,
  wrapAsync(async (req, res) => {
    const regionId = req.params.id;
    const region = await Region.findById(regionId);
    if (!region) {
      return res.status(404).json({
        message: "Region not found",
      });
    }
    // check if a new image file was uploaded
    if (req.body.image) {
      region.image = req.body.image;
    }
    // update the region document with the request body
    Object.assign(region, req.body);
    await region.save();
    return res.json(region);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const regionId = req.params.id;
    const region = await Region.findById(regionId);
    if (!region) {
      return res.status(404).json({
        message: "Region not found",
      });
    }
    await Region.deleteOne({ _id: regionId });
    return res.json({ status: "sucess", message: "Region deleted" });
  })
);

module.exports = router;
