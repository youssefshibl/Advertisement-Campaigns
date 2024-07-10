const jwt = require("jsonwebtoken");

let auth_middle_ware = async function (req, res, next) {
  let path = req.path;
  let method = req.method;
  const secret = process.env.JWT_SECRET;

  let token = req.headers["authorization"];
  // seperate token from bearer
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res
      .status(401)
      .send({ success: false, message: "missing jwt token" });
  }
  try {
    const authnToken = jwt.verify(token, secret);
    let email = authnToken.email;
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).send({
        success: false,
        message: "invalid email",
      });
    }
    req.email = email;
    next();
  } catch (err) {
    res.status(400).send({ success: false, message: "token is not valid" });
  }
};

module.exports = auth_middle_ware;
