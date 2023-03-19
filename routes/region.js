var express = require("express");
var router = express.Router();
var multer = require("multer");
var Region = require("../models/region");
var { wrapAsync } = require("../helper/catchHandler");

//file or image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

//filtering the requested file
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    console.log("Image should be in jpeg || png || jpg format");
  }
};

//limiting the size of file
const uploads = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const type = uploads.single("image");

//routes
router.post(
  "/",
  type,
  wrapAsync(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        data: { image: "No image selected" },
      });
    }
    const regionDetails = {
      title: req.body.title,
      description: req.body.description,
      image: req.file.path,
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
    if (req.file) {
      region.image = req.file.path;
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
