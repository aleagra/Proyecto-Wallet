const { User } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  console.log(req.body);
  User.findOne({
    where: {
      user: req.body.username,
    },
  }).then((user) => {
    if (!user) {
      return res.status(401).send({ message: "Error user not found" });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Error user not found" });
    }

    var tokenAccess = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: 86400,
    });
    user.token = tokenAccess;
    res.status(200).send({
      user,
      tokenAccess,
    });
  });
};
module.exports = login;
