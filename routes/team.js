var express = require("express");
var router = express.Router();
var multer = require("multer");
const upload = multer();
var Team = require("../models/team");
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
    const teamDetails = {
      name: req.body.name,
      role: req.body.role,
      image: req.body.image,
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
    if (req.body.image) {
      team.image = req.body.image;
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
