require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pets", require("./routes/petRoutes"));
const favoriteRoutes = require("./routes/favorites");
app.use("/api/favorites", favoriteRoutes);


app.get("/", (req, res) => {
  res.send("Pet Adopt Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
