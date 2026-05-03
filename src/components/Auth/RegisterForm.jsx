import { useState } from "react";
import RoleSelector from "./RoleSelector";
import { showSuccess, showError } from "../../utils/toast";

export default function RegisterForm({ setActiveTab }) {
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    university: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setLoading(true);

    const payload = {
      username: form.email,
      password: form.password,
      role: role,
      name: form.name,
    };

    if (role === "student") {
      payload.university = form.university;
    } else {
      payload.company_name = form.companyName;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
       showSuccess("Registration successful");
        setActiveTab("login"); // 🔥 SWITCH TAB
      } else {
        showError(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <RoleSelector role={role} setRole={setRole} />

      {role === "student" && (
        <>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="student@mail.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
          />

          <label>University</label>
          <input
            type="text"
            placeholder="MIT, Stanford..."
            onChange={(e) => setForm({ ...form, university: e.target.value })}
          />
        </>
      )}

      {role === "company" && (
        <>
          <label>Company Name</label>
          <input
            type="text"
            placeholder="Acme Corp"
            onChange={(e) =>
              setForm({
                ...form,
                companyName: e.target.value,
              })
            }
          />

          <label>Work Email</label>
          <input
            type="email"
            placeholder="hr@company.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
          />
        </>
      )}

      <button className="btn" disabled={loading}>
        {loading ? "Registering..." : "Register →"}
      </button>
    </form>
  );
}
