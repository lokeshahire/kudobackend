const express = require("express");
const UserModel = require("../models/User.model");
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { name, pass } = req.body;

  try {
    const user = new UserModel({ name, pass });
    await user.save();
    res.send({ msg: "Registration successful" });
  } catch (e) {
    res.send({ msg: "User registration failed", error: e.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { name } = req.body;

  try {
    const user = await UserModel.findOne({ name });
    if (user) {
      res.status(200).send({ msg: "Login Sucessful" });
    } else {
      res.status(400).send({ msg: "User not Found", error: e.message });
    }
  } catch (e) {
    res.send({ msg: "Login failed", error: e.message });
  }
});

userRouter.get("/:name", async (req, res) => {
  const user = await UserModel.findOne({ name: req.params.name });
  res.json({ exists: !!user, user });
});

userRouter.get("/", async (req, res) => {
  const { name } = req.query;

  if (name) {
    const user = await UserModel.findOne({ name });
    return res.json({ exists: !!user, user });
  }

  const users = await UserModel.find({});
  res.json({ users });
});

userRouter.patch("/kudos/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const user = await UserModel.findOneAndUpdate(
      { name },
      { $inc: { kudos: 1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Kudos updated successfully!", user });
  } catch (error) {
    console.error("Error updating Kudos:", error);
    res.status(500).json({ message: "Server error. Could not update Kudos." });
  }
});

module.exports = { userRouter };
