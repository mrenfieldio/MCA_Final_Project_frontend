import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function SelectedCandidatesContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSelectedCandidates();
  }, []);

  const fetchSelectedCandidates = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/company/selected-candidates/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="selected-page">
      {/* HEADER */}
      <div className="section-header">
        <div>
          <h1>Selected Candidates</h1>

          <p>Manage active interns and performance</p>
        </div>
      </div>

      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}
      <div className="selected-table-wrapper">
        <table className="selected-table">
          <thead>
            <tr>
              <th>Student</th>

              <th>Position</th>

              <th>Duration</th>

              <th>Joined</th>

              <th>Progress</th>

              <th>Assignments</th>

              <th>Score</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  Loading selected candidates...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  No selected candidates
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  {/* STUDENT */}
                  <td>
                    <div className="student-cell">
                      {/* <div className="student-avatar">

                        {student.student_name
                          ?.charAt(0)}

                      </div> */}

                      <div>
                        <h4>{student.student_name}</h4>

                        <p>{student.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* POSITION */}
                  <td>{student.job_title}</td>

                  {/* DURATION */}
                  <td>{student.internship_duration} Months</td>

                  {/* JOINED */}
                  <td>{student.joined_at}</td>

                  {/* PROGRESS */}
                  <td>
                    <div className="table-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${student.progress}%`,
                          }}
                        />
                      </div>

                      <span>{student.progress}%</span>
                    </div>
                  </td>

                  {/* ASSIGNMENTS */}
                  <td>
                    {student.assignments_completed}/{student.total_assignments}
                  </td>

                  {/* SCORE */}
                  <td>
                    <span className="score-badge">{student.score}%</span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="action-wrapper">
                      {/* THREE DOT BUTTON */}
                      <button
                        className="menu-btn"
                        onClick={(e) => {
                          if (openMenu === student.id) {
                            setOpenMenu(null);
                          } else {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setMenuPosition({
                              top: rect.bottom + window.scrollY + 8,
                              right: window.innerWidth - rect.right,
                            });
                            setOpenMenu(student.id);
                          }
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* DROPDOWN via Portal to escape table overflow */}
                      {openMenu === student.id &&
                        createPortal(
                          <div
                            className="action-dropdown"
                            style={{
                              position: "absolute",
                              top: `${menuPosition.top}px`,
                              right: `${menuPosition.right}px`,
                              maxHeight: "150px",
                              overflowY: "auto",
                            }}
                          >
                            {/* <button>
                            Assign Task
                          </button> */}

                            <button>Make Payment</button>

                            <button
                              onClick={() =>
                                setSearchParams({
                                  page: "internship-detail",
                                  id: student.id,
                                })
                              }
                            >
                              View Details
                            </button>

                            {/* <button className="danger-action">
                            Remove Intern
                          </button> */}
                          </div>,
                          document.body,
                        )}
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
