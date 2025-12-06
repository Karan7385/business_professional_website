import Logo from "../assets/logos/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

export default function LoginPage() {
  const BASE_SERVER_URL = "http://localhost:3000";

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_SERVER_URL}/api/auth/login`,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Axios throws on non-2xx, so if we're here, it's already a success (2xx)
      const data = res.data || {};

      // If your backend returns a token:
      if (data.token) {
        const maxAgeDays = 1; // adjust as you like
        const expires = new Date(
          Date.now() + maxAgeDays * 24 * 60 * 60 * 1000
        ).toUTCString();

        document.cookie = `admin_token=${data.token}; expires=${expires}; path=/`;
      }

      toast.success(data.message || "Logged in successfully!");
      
      navigate("/admin");
    } catch (err) {
      console.error(err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong while logging in.";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Global toaster for this page */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "0.85rem",
          },
        }}
      />

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-10">
          {/* Logo + Business Name */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-3">
              <img
                src={Logo}
                alt="Business Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/64x64/7a1d1d/ffffff?text=LOGO";
                }}
              />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 text-center">
              <span className="bg-clip-text text-transparent bg-linear-to-r from-[#7a1d1d] via-[#c43535] to-[#fd3d3d]">
                PT INDO Admin
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Secure access to your admin dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15622855] focus:border-[#156228] transition"
                placeholder="Enter your username"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15622855] focus:border-[#156228] transition"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex justify-center items-center rounded-lg bg-linear-to-r from-[#281d7a] via-[#3e2ebd] to-[#4e38f2] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#281d7a] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border border-white/70 border-t-transparent" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer text */}
          <p className="mt-4 text-[11px] text-center text-gray-400">
            © {new Date().getFullYear()} PT INDO. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}