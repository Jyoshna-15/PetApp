const express = require("express");
const router = express.Router();
const multer = require("multer");

const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const protect = require("../middleware/authMiddleware");

const {
  createPet,
  getAllPets,
  getMyPets,
  updatePet,
  deletePet,
} = require("../controllers/petController");

router.post("/", protect, upload.single("image"), createPet);
router.get("/", getAllPets);
router.get("/mypets", protect, getMyPets);
router.put("/:id", protect, updatePet);
router.delete("/:id", protect, deletePet);

module.exports = router;
