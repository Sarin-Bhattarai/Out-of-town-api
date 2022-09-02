var Faq = require("../models/faq");

module.exports = {
  postFaq: async (req, res) => {
    const faqDetails = {
      title: req.body.title,
      description: req.body.description,
    };
    const faqs = new Faq(faqDetails);
    const result = await faqs.save();
    return res.status(200).json(result);
  },

  getallFaqs: async (req, res) => {
    const faqs = await Faq.find();
    return res.json(faqs);
  },

  updateFaq: async (req, res) => {
    const faqId = req.params.id;
    const faq = await Faq.findById(faqId);
    if (!faq) {
      return res.status(404).json({
        message: "Faq not found",
      });
    }
    const updatedFaq = await Faq.findByIdAndUpdate(faqId, {
      ...req.body,
    });
    return res.json(updatedFaq);
  },

  deleteFaq: async (req, res) => {
    const faqId = req.params.id;
    const faq = await Faq.findById(faqId);
    if (!faq) {
      return res.status(404).json({
        message: "Faq not found",
      });
    }
    await Faq.deleteOne({ _id: faqId });
    return res.json({ status: "sucess", message: "Faq deleted" });
  },
};
