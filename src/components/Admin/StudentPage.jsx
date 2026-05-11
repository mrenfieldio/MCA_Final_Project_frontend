import { useState, useEffect } from "react";
import { SectionHeader, StatusBadge } from "./AdminShared";

export default function StudentsPage() {

  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  // 🔥 FETCH STUDENTS
  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/administrator/students/",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setStudents(data);

    } catch (error) {

      console.error(
        "Error fetching students:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // 🔥 FILTERING
  const filtered = students.filter((s) =>

    (filter === "all" ||
      s.status === filter)

    &&

    (
      s.name
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      s.email
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  // 🔥 ACTIVATE / DEACTIVATE
  const toggleStatus = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        `http://localhost:8000/api/administrator/students/${id}/toggle-status/`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status:
                  s.status === "active"
                    ? "inactive"
                    : "active",
              }
            : s
        )
      );

    } catch (error) {

      console.error(
        "Status update failed:",
        error
      );
    }
  };

  // 🔥 DELETE STUDENT
  const removeStudent = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmDelete) return;

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        `http://localhost:8000/api/administrator/students/${id}/`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents((prev) =>
        prev.filter((s) => s.id !== id)
      );

    } catch (error) {

      console.error(
        "Delete failed:",
        error
      );
    }
  };

  return (
    <div>

      <SectionHeader
        title="Students"
        subtitle={`${students.length} total registered`}
      />

      {/* 🔥 FILTER BAR */}
      <div className="filter-bar">

        <input
          className="search-input"
          placeholder="Search students..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {["all", "active", "inactive"].map((f) => (

          <button
            key={f}
            className={`filter-btn ${
              filter === f ? "active" : ""
            }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>

        ))}

      </div>

      {/* 🔥 TABLE */}
      <div className="table-wrap">

        <table className="data-table">

          <thead>
            <tr>

              {[
                "Student",
                "Course",
                "Skills",
                "Applications",
                "Status",
                "Actions",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}

            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  Loading students...
                </td>
              </tr>

            ) : filtered.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No students found
                </td>
              </tr>

            ) : (

              filtered.map((s) => (

                <tr key={s.id}>

                  {/* 🔥 STUDENT */}
                  <td>

                    <div className="entity-cell">

                      {/* <div className="entity-avatar student">

                        {s.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}

                      </div> */}

                      <div>

                        <p className="entity-name">
                          {s.name}
                        </p>

                        <p className="entity-sub">
                          {s.email}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* 🔥 COURSE */}
                  <td>
                    {s.course}
                  </td>

                  {/* 🔥 SKILLS */}
                  <td>

                    <div className="skill-tags">

                      {s.skills?.map((sk) => (

                        <span
                          key={sk}
                          className="skill-tag"
                        >
                          {sk}
                        </span>

                      ))}

                    </div>

                  </td>

                  {/* 🔥 APPLICATIONS */}
                  <td className="cell-accent-amber">
                    {s.apps}
                  </td>

                  {/* 🔥 STATUS */}
                  <td>
                    <StatusBadge status={s.status} />
                  </td>

                  {/* 🔥 ACTIONS */}
                  <td>

                    <div className="action-row">

                      <button
                        className={`action-btn ${
                          s.status === "active"
                            ? "deactivate"
                            : "activate"
                        }`}
                        onClick={() =>
                          toggleStatus(s.id)
                        }
                      >
                        {s.status === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        className="action-btn delete"
                        onClick={() =>
                          removeStudent(s.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}