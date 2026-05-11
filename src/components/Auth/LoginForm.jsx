import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const payload = {
      username: form.email,
      password: form.password,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("role", data.role);
        localStorage.setItem("is_admin", data.is_admin);

        // 🔁 Redirect
        if (data.is_admin) {
          navigate("/admin-dashboard");
        } else if (data.role === "student") {
          navigate("/student-dashboard");
        } else {
          navigate("/company-dashboard");
        }
      } else {
        showError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>Email Address</label>
      <input
        type="email"
        placeholder="you@example.com"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <label>Password</label>

      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="********"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </form>
  );
}
