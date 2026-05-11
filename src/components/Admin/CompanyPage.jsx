import { useState, useEffect } from "react";

import {
  SectionHeader,
  StatusBadge,
} from "./AdminShared";

export default function CompaniesPage() {

  const [companies, setCompanies] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // 🔥 FETCH COMPANIES
  // =====================================
  useEffect(() => {

    fetchCompanies();

  }, []);

  const fetchCompanies = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/administrator/companies/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setCompanies(data);

    } catch (error) {

      console.error(
        "Error fetching companies:",
        error
      );

    } finally {

      setLoading(false);
    }
  };


  const filtered = companies.filter((c) =>

    (filter === "all" ||
      c.status === filter)

    &&

    (
      c.name
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      c.email
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );


  const setStatus = async (
    id,
    status
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        `http://localhost:8000/api/administrator/companies/${id}/status/`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, status }
            : c
        )
      );

    } catch (error) {

      console.error(
        "Status update failed:",
        error
      );
    }
  };

 
  const removeCompany = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this company?"
      );

    if (!confirmDelete) return;

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        `http://localhost:8000/api/administrator/companies/${id}/`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setCompanies((prev) =>
        prev.filter((c) => c.id !== id)
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
        title="Companies"
        subtitle={`${companies.length} total registered`}
      />

      {/* 🔥 FILTER BAR */}
      <div className="filter-bar">

        <input
          className="search-input"
          placeholder="Search companies..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {[
          "all",
          "approved",
          "suspended",
        ].map((f) => (

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
                "Company",
                // "Industry",
                "Email",
                "Jobs",
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
                  Loading companies...
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
                  No companies found
                </td>
              </tr>

            ) : (

              filtered.map((c) => (

                <tr key={c.id}>

                  {/* 🔥 COMPANY */}
                  <td>

                    <div className="entity-cell">

                      {/* <div className="entity-avatar company">

                        {c.name
                          ?.charAt(0)
                          ?.toUpperCase()}

                      </div> */}

                      <span className="entity-name">
                        {c.name}
                      </span>

                    </div>

                  </td>

                  {/* 🔥 INDUSTRY */}
                  {/* <td>
                    {c.industry}
                  </td> */}

                  {/* 🔥 EMAIL */}
                  <td>
                    {c.email}
                  </td>

                  {/* 🔥 JOBS */}
                  <td className="cell-accent-blue">
                    {c.jobs}
                  </td>

                  {/* 🔥 STATUS */}
                  <td>
                    <StatusBadge status={c.status} />
                  </td>

                  {/* 🔥 ACTIONS */}
                  <td>

                    <div className="action-row">

                      {c.status !==
                        "approved" && (

                        <button
                          className="action-btn approve"
                          onClick={() =>
                            setStatus(
                              c.id,
                              "approved"
                            )
                          }
                        >
                          Approve
                        </button>
                      )}

                      {c.status !==
                        "suspended" && (

                        <button
                          className="action-btn suspend"
                          onClick={() =>
                            setStatus(
                              c.id,
                              "suspended"
                            )
                          }
                        >
                          Suspend
                        </button>
                      )}

                      <button
                        className="action-btn delete"
                        onClick={() =>
                          removeCompany(c.id)
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