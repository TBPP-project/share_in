const express = require("express");
const connectDB = require("./utils/db.js");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    name: 'in_share backend',
    team: 'Group 28',
    version: '1.0.0',
    members: ['vikash', 'gautam', 'vedhanshu', 'neelam']
  });
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
