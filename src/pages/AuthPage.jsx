import { useState } from "react";
import Navbar from "../components/Navbar";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";
import "../styles/global.css";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <div className="auth-box">
          <h1 className="title">Welcome </h1>
          <p className="subtitle">Sign in to continue to your dashboard</p>

          <div className="tabs">
            <button
              className={activeTab === "login" ? "active" : ""}
              onClick={() => setActiveTab("login")}
            >
              Sign In
            </button>

            <button
              className={activeTab === "register" ? "active" : ""}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          {activeTab === "login" ? (
            <LoginForm />
          ) : (
            <RegisterForm setActiveTab={setActiveTab} />
          )}
        </div>
      </div>
    </>
  );
}
