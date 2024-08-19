const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const authRoute = require('./routes/auth'); 
const usersRoute = require('./routes/users'); 
const postsRoute = require('./routes/posts'); 
const multer = require("multer");
const path = require("path");

dotenv.config();

// Database Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected Successfully!!!!!!!"))
  .catch((err) => console.error("DB Connection Error: ", err));

app.use("/images", express.static(path.join(__dirname, "public/images")));

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

// Routes
app.use("/api/auth", authRoute); // Mount authRoute under /api/auth
app.use("/api/users", usersRoute); // Mount usersRoute under /api/users
app.use("/api/posts", postsRoute); // Mount postsRoute under /api/posts



// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}!!!!!!!!`);
});
