var HomeDesc = require("../models/home-desc");

module.exports = {
  postHomeDesc: async (req, res) => {
    const descDetails = {
      description: req.body.description,
    };
    const descs = new HomeDesc(descDetails);
    const result = await descs.save();
    return res.status(200).json(result);
  },

  getallDescs: async (req, res) => {
    const descs = await HomeDesc.find();
    return res.json(descs);
  },

  updateDescs: async (req, res) => {
    const descId = req.params.id;
    const desc = await HomeDesc.findById(descId);
    if (!desc) {
      return res.status(404).json({
        message: "Description not found",
      });
    }
    const updatedDesc = await HomeDesc.findByIdAndUpdate(descId, {
      ...req.body,
    });
    return res.json(updatedDesc);
  },

  deleteDesc: async (req, res) => {
    const descId = req.params.id;
    const desc = await HomeDesc.findById(descId);
    if (!desc) {
      return res.status(404).json({
        message: "Description not found",
      });
    }
    await HomeDesc.deleteOne({ _id: descId });
    return res.json({ status: "sucess", message: "Description deleted" });
  },
};
