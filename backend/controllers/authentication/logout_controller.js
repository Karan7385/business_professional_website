import { create_logs } from "../../models/logs/logs_model.js";

async function logout_controller(req, res) {
  try {
    // Clear JWT cookie
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("access_token", "", {
      httpOnly: true,
      secure: isProd,     // true in production with HTTPS
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    // Log logout event
    await create_logs(
      "logout",
      `User ptindo_admin123 logged out at ${new Date().toISOString()}`
    );

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Error in logout_controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during logout.",
    });
  }
}

export default logout_controller;