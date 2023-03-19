var express = require("express");
var router = express.Router();
var multer = require("multer");
var Team = require("../models/team");
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
    const teamDetails = {
      name: req.body.name,
      role: req.body.role,
      image: req.file.path,
    };
    const teams = new Team(teamDetails);
    const result = await teams.save();
    return res.status(200).json(result);
  })
);

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const teams = await Team.find();
    return res.json(teams);
  })
);

router.patch(
  "/:id",
  type,
  wrapAsync(async (req, res) => {
    const teamId = req.params.id;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }
    if (req.file) {
      team.image = req.file.path;
    }
    // update the team document with the request body
    Object.assign(team, req.body);
    await team.save();
    return res.json(team);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const teamId = req.params.id;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        message: "Person not found",
      });
    }
    await Team.deleteOne({ _id: teamId });
    return res.json({ status: "sucess", message: "Team deleted" });
  })
);

module.exports = router;
