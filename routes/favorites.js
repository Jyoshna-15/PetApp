const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const User = require("../models/User");
const Pet = require("../models/Pet");


// ⭐ TOGGLE FAVORITE (ADD OR REMOVE)
router.post("/:petId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const petId = req.params.petId;

    const user = await User.findById(userId);

    const alreadyFav = user.favorites.includes(petId);

    if (alreadyFav) {
      // remove
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== petId
      );
    } else {
      // add
      user.favorites.push(petId);
    }

    await user.save();

    res.json({ favorites: user.favorites });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ⭐ GET MY FAVORITES
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("favorites"); // ⭐ get full pet data

    res.json(user.favorites);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
