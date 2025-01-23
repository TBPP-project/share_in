const express = require("express");
const connectDB = require("./utils/db.js");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser  = require('body-parser');
const User = require("./models/user_model.js");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({
    name: 'in_share backend',
    team: 'Group 28',
    version: '1.0.0',
    members: ['vikash', 'gautam', 'vedhanshu', 'neelam']
  });
});

app.post("/register", async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  const token = jwt.sign({email, username}, process.env.JWT_SECRET, { expiresIn: "1800s" })


  return res.status(200).json({
    message: "User Logged in Successfully",
    'user': user,
    'token': token,
  });
});


app.post("/login", async function(req, res){
  try {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        const result = req.body.password === user.password;
        if (result) {
          res.render("secret");
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
