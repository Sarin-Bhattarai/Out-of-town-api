var express = require("express");
var router = express.Router();
var multer = require("multer");
const upload = multer();
var SubRegion = require("../models/sub-region");
var { wrapAsync } = require("../helper/catchHandler");

const type = upload.none();

//routes
router.post(
  "/",
  type,
  wrapAsync(async (req, res) => {
    if (!req.body.images) {
      return res.status(400).json({
        status: "fail",
        data: { image: "No images selected" },
      });
    }
    const imageUrls = Object.values(JSON.parse(req.body.images));
    // console.log(req.files);
    const subRegionDetails = {
      title: req.body.title,
      description: req.body.description,
      image: imageUrls,
      includedetails: req.body.includedetails,
      excludedetails: req.body.excludedetails,
    };
    const subRegions = new SubRegion(subRegionDetails);
    const result = await subRegions.save();
    return res.status(200).json(result);
  })
);

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const subRegions = await SubRegion.find();
    return res.json(subRegions);
  })
);

router.patch(
  "/:id",
  type,
  wrapAsync(async (req, res) => {
    const subRegionId = req.params.id;
    const subRegion = await SubRegion.findById(subRegionId);
    if (!subRegion) {
      return res.status(404).json({
        message: "Sub-Region not found",
      });
    }
    if (req.body.images) {
      const imageUrls = Object.values(JSON.parse(req.body.images));
      if (imageUrls.length > 0) {
        subRegion.image = imageUrls;
      }
    }
    Object.assign(subRegion, req.body);
    await subRegion.save();
    return res.json(subRegion);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const subRegionId = req.params.id;
    const subRegion = await SubRegion.findById(subRegionId);
    if (!subRegion) {
      return res.status(404).json({
        message: "Sub-Region not found",
      });
    }
    await SubRegion.deleteOne({ _id: subRegionId });
    return res.json({ status: "sucess", message: "Sub-Region deleted" });
  })
);

module.exports = router;
