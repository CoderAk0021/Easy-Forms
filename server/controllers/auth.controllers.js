import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60 * 1000,
  };
}

export function handleLogin(req, res) {
  try {
    const { username, password } = req.body;
    if (username === process.env.USER && password === process.env.PASS) {
      const token = jwt.sign(
        { sub: username, role: "admin" },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" },
      );
      res.cookie("token", token, getCookieOptions());
      return res.status(200).json({
        success: true,
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  } catch (error) {
    console.log("Error at Auth.js : ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export function handleVerify(req, res) {
  res.json({
    success: true,
    user: req.user,
  });
}

export function handleLogout(_req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  return res.status(200).json({ success: true });
}
