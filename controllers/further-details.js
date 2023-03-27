var FurtherDetails = require("../models/further-details");

module.exports = {
  postFurtherDetails: async (req, res) => {
    const furtherDetails = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
    };
    const furthers = new FurtherDetails(furtherDetails);
    const result = await furthers.save();
    return res.status(200).json(result);
  },

  getallFurtherDetails: async (req, res) => {
    const furthers = await FurtherDetails.find();
    return res.json(furthers);
  },

  updateFurtherDetails: async (req, res) => {
    const furtherId = req.params.id;
    const furtherDetails = await FurtherDetails.findById(furtherId);
    if (!furtherDetails) {
      return res.status(404).json({
        message: "FurtherDetails not found",
      });
    }
    const updatedFurther = await FurtherDetails.findByIdAndUpdate(furtherId, {
      ...req.body,
    });
    return res.json(updatedFurther);
  },

  deleteFurtherDetails: async (req, res) => {
    const furtherId = req.params.id;
    const furtherDetails = await FurtherDetails.findById(furtherId);
    if (!furtherDetails) {
      return res.status(404).json({
        message: "FurtherDetails not found",
      });
    }
    await FurtherDetails.deleteOne({ _id: furtherId });
    return res.json({ status: "sucess", message: "FurtherDetails deleted" });
  },
};
