const express = require("express");
const KudoModel = require("../models/Kudos.model");
const kudoRouter = express.Router();

kudoRouter.post("/", async (req, res) => {
  const kudos = new KudoModel(req.body);
  await kudos.save();
  res.json({ success: true });
});

kudoRouter.get("/analytics", async (req, res) => {
  const kudos = await KudoModel.find({});
  const leaderboard = kudos.reduce((acc, kudo) => {
    acc[kudo.recipient] = (acc[kudo.recipient] || 0) + 1;
    return acc;
  }, {});
  const mostLiked = kudos.sort((a, b) => b.likes - a.likes)[0];
  res.json({ leaderboard, mostLiked });
});

kudoRouter.post("/give", async (req, res) => {
  try {
    const { giver, recipient, badge, reason, likes = 1 } = req.body;

    if (!giver || !recipient || !badge || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updatedKudos = await KudoModel.findOneAndUpdate(
      { recipient, badge, reason },
      { $inc: { likes } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res
      .status(200)
      .json({ message: "Kudos processed successfully!", updatedKudos });
  } catch (error) {
    console.error("Error giving Kudos:", error);
    res.status(500).json({ message: "Server error. Could not process Kudos." });
  }
});

kudoRouter.get("/badgeLikes", async (req, res) => {
  try {
    const kudos = await KudoModel.find();
    const badgeLikes = kudos.reduce((acc, kudo) => {
      acc[kudo.badge] = (acc[kudo.badge] || 0) + (kudo.likes || 0);
      return acc;
    }, {});

    res.json({ badgeLikes });
  } catch (error) {
    console.error("Error fetching badge likes:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch badge likes." });
  }
});

module.exports = { kudoRouter };
