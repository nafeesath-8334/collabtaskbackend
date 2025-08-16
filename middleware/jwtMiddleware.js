const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  console.log("inside jwtMiddleware");

  const token =
    req.headers["authorization"] &&
    req.headers["authorization"].split(" ")[1].replace(/^"|"$/g, "");
  console.log("Received token:", token);

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    const jwtResponse = jwt.verify(token, secretKey); // should include id, role, etc.
    console.log("jwtResponse:", jwtResponse);

    req.user = jwtResponse; // <-- IMPORTANT: Attach decoded payload
    next();
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Authorization failed, token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Authorization failed, invalid token" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = jwtMiddleware;
// const jwt = require("jsonwebtoken");

// const jwtMiddleware = (req, res, next) => {
//   const authHeader = req.headers["authorization"] || req.headers["Authorization"];
//   if (!authHeader) {
//     return res.status(401).json({ message: "Authorization token missing" });
//   }

//   const token = authHeader.split(" ")[1]?.replace(/^"|"$/g, "");
//   if (!token) {
//     return res.status(401).json({ message: "Invalid authorization header" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "Authorization failed, token expired" });
//     }
//     return res.status(401).json({ message: "Authorization failed, invalid token" });
//   }
// };

// module.exports = jwtMiddleware;



