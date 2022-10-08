import jwt from "jsonwebtoken";
export function validateRegister(req, res, next) {
  //username min 3
  if (!req.body.username || req.body.username.length < 3) {
    return res.status(400).json({
      success: false,
      status: res.statusCode,
      message: "Username must be min 3 characters",
    });
  }
  //password min 6
  if (!req.body.password || req.body.password.length < 6) {
    return res.status(400).json({
      success: false,
      status: res.statusCode,
      message: "Password must be min 6 characters",
    });
  }

  //passwords must match
  if (
    !req.body.password_repeat ||
    req.body.password != req.body.password_repeat
  ) {
    return res.status(400).json({
      success: false,
      status: res.statusCode,
      message: "Passwords doesnt match!",
    });
  }
  return next();
}
export function isAdmin(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(400).json({
      message: "Unauthorized!",
    });
  }
  try {
    const { Password, ...decoded } = jwt.verify(token, "SECRETKEY");
    console.log(decoded);
    if (decoded.type == 1) {
      return next();
    } else {
      return res
        .status(400)
        .json({ status: res.statusCode, message: "Unauthorized!" });
    }
  } catch (error) {
    return res.status(400).json({
      status: res.statusCode,
      message: error.message,
    });
  }
}
export function isLoggedIn(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    //Bearer token
    const token = authHeader.split(" ")[1];
    const { Password, ...decoded } = jwt.verify(token, "SECRETKEY");

    req.userData = decoded;
    return next();
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      message: "Your session is not valid!",
    });
  }
}
