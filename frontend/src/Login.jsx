import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function Login({ setUsername }) {
  const [formData, setFormData] = useState({ username: "", password: "", type: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          type:
            formData.type === "individual"
              ? "Individual"
              : formData.type === "organization"
              ? "Organisation"
              : "Bank Employee",
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Redirect based on user type
        if (data.Type === "Individual" || data.Type === "Organisation") {
          setUsername(formData.username);
          navigate("/user");
        } else if (data.Type === "Bank Employee") {
          navigate("/employee");
        }
      } else {
        setError(data.detail || "Login failed. Please check your details.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          body, html, #root { height: 100%; margin: 0; }
          .page-container { display: flex; flex-direction: column; min-height: 100vh; }
          .login-container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 5vw; font-family: Arial, sans-serif; background: #f2f6fc; }
          .login-box { background: #fff; padding: 4vh 3vw; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 350px; }
          .login-box h2 { text-align: center; margin-bottom: 25px; color: #003366; }
          .login-box label { display: block; margin: 10px 0 5px; font-weight: bold; }
          .login-box input, .login-box select { width: 100%; padding: 1vw; margin-bottom: 2vh; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box; }
          .login-box select { background-color: #fff; cursor: pointer; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
          .login-box select:focus { border-color: rgba(0, 51, 102, 1); box-shadow: 0 0 5px rgba(0, 51, 102, 0.3); outline: none; }
          .login-box button { width: 100%; padding: 14px; background: #003366; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
          .login-box button:hover { background: #0055aa; }
          .login-box button:disabled { background: #ccc; color: #666; cursor: not-allowed; opacity: 0.7; }
          .error { color: red; text-align: center; margin-bottom: 10px; font-size: 14px; }
          .login-links { display: flex; justify-content: space-between; margin-top: 15px; }
          .login-links a { color: #003366; text-decoration: none; font-size: 14px; }
          .login-links a:hover { text-decoration: underline; }
        `}
      </style>

      <Header />
      <div className="page-container">
        <div className="login-container">
          <div className="login-box">
            <h2>Login</h2>

            {error && <div className="error">{error}</div>}

            <label>Username (ID)</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />

            <label>User Type</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="individual">Individual</option>
              <option value="organization">Organization</option>
              <option value="employee">Bank Employee</option>
            </select>

            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !formData.username.trim() ||
                !formData.password.trim() ||
                !formData.type.trim()
              }
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="login-links">
              <a href="/ForgotPassword">Forgot Password?</a>
              <a href="/Signup">New User? Signup</a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
