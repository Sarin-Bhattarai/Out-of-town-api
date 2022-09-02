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

router.get("/", wrapAsync());

router.patch("/:id", wrapAsync());

router.delete("/:id", wrapAsync());

module.exports = router;
