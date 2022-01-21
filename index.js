const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const Input = require("./models/Input");
const Database = require("./driver");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Set Templating Enginge
app.set("view engine", "ejs");

app.get("", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post(
  "/register",
  urlencodedParser,
  [
    check("username", "This username must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
    check(
      "password",
      "The password should contain at least 5 characters"
    ).isLength({ min: 5 }),
    check("password1").custom((password1, { req }) => {
      const pw = req.body.password;
      if (pw !== password1) {
        throw new Error("Passwords must be same");
      }
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render("register", {
        alert,
      });
    } else {
      const input = new Input({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      const input1 = new Database();
      input1.store(input);
    }
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.info(`Listening on port ${port}`));
