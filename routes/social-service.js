var express = require("express");
var router = express.Router();
var multer = require("multer");
var Service = require("../models/social-service");
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

const type = uploads.array("image", 3);

//routes
router.post(
  "/",
  type,
  wrapAsync(async (req, res) => {
    if (!req.files) {
      return res.status(400).json({
        status: "fail",
        data: { image: "No images selected" },
      });
    }
    const serviceDetails = {
      title: req.body.title,
      description: req.body.description,
      image: req.files.map((item) => item.path),
    };
    const services = new Service(serviceDetails);
    const result = await services.save();
    return res.status(200).json(result);
  })
);

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const services = await Service.find();
    return res.json(services);
  })
);

router.patch(
  "/:id",
  type,
  wrapAsync(async (req, res) => {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }
    const updatedService = await Service.findByIdAndUpdate(serviceId, {
      ...req.body,
    });
    return res.json(updatedService);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }
    await Service.deleteOne({ _id: serviceId });
    return res.json({ status: "sucess", message: "Service deleted" });
  })
);

module.exports = router;
