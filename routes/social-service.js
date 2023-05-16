var express = require("express");
var router = express.Router();
var multer = require("multer");
const upload = multer();
var Service = require("../models/social-service");
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
    console.log("hi");
    console.log("req.body", req.body);

    // Decode the JSON object and extract the image URLs
    const imageUrls = Object.values(JSON.parse(req.body.images));

    const serviceDetails = {
      title: req.body.title,
      description: req.body.description,
      image: imageUrls, // Use the array of image URLs
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

    // check if a new image file was uploaded

    if (req.body.images) {
      // Decode the JSON object and extract the image URLs
      const imageUrls = Object.values(JSON.parse(req.body.images));

      service.image = imageUrls;
    }
    Object.assign(service, req.body);
    await service.save();
    return res.json(service);
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
