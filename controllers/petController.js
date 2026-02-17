const Pet = require("../models/Pet");

// CREATE PET
exports.createPet = async (req, res) => {
  try {
    const {
      name,
      category,
      breed,
      age,
      gender,
      weight,
      address,
      about,
    } = req.body;

    const pet = await Pet.create({
      name,
      category,
      breed,
      age,
      gender,
      weight,
      address,
      about,
      image: req.file?.path || "",
      owner: req.user.id,   // ⭐ FIX HERE
    });

    res.status(201).json(pet);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// GET ALL PETS
exports.getAllPets = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) filter.category = category;

    const pets = await Pet.find(filter).populate("owner", "name email");

    res.json(pets);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET MY PETS
exports.getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id }) // ⭐ FIX
      .populate("owner", "name email");

    res.json(pets);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE PET
exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ message: "Pet not found" });

    if (pet.owner.toString() !== req.user.id) {  // ⭐ FIX
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedPet);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE PET
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ message: "Pet not found" });

    if (pet.owner.toString() !== req.user.id) { // ⭐ FIX
      return res.status(401).json({ message: "Not authorized" });
    }

    await pet.deleteOne();

    res.json({ message: "Pet deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
