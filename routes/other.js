var express = require("express");
var router = express.Router();
var multer = require("multer");
var Other = require("../models/other");
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
    const otherDetails = {
      title: req.body.title,
      image: req.file.path,
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
    if (req.file) {
      other.image = req.file.path;
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
