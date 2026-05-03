export default function RoleSelector({ role, setRole }) {
  return (
    <div className="role-selector">
      <div
        className={role === "student" ? "role active" : "role"}
        onClick={() => setRole("student")}
      >
        Student
      </div>

      <div
        className={role === "company" ? "role active" : "role"}
        onClick={() => setRole("company")}
      >
        Company
      </div>
    </div>
  );
}