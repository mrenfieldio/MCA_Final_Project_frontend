import { useEffect, useState } from "react";

import { IconCurrencyRupee, IconSearch } from "@tabler/icons-react";

import "../../styles/CompanyPaymentsPage.css";

export default function CompanyPaymentsPage({ setShowPostModal }) {
 

  const [internships, setInternships] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");



  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/company/payments/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      setInternships(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handlePayNow = async (internshipId, month, stipend) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Create order
      const orderResponse = await fetch(
        "http://localhost:8000/api/payment/create-order/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: parseInt(stipend) }),
        },
      );

      const orderData = await orderResponse.json();

     
      const options = {
        key: orderData.key,
        amount: orderData.amount * 100,
        currency: "INR",
        name: "ProLinker",
        description: `Stipend Payment for Month ${month}`,
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            const payResponse = await fetch(
              "http://localhost:8000/api/company/pay-now/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  internship_id: internshipId,
                  month: month,
                  amount: stipend,
                  transaction_id: response.razorpay_payment_id,
                }),
              },
            );

            if (payResponse.ok) {
              fetchPayments(); 
            }
          } catch (err) {
            console.error("Failed to record payment:", err);
          }
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
    }
  };

  

  const filteredInternships = internships.filter(
    (item) =>
      item.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      item.student_name?.toLowerCase().includes(search.toLowerCase()),
  );

 

  return (
    <div className="payments-page">
      {/* HEADER */}
      <div className="payments-header">
        <div>
          <h1>Internship Payroll</h1>

          <p>Monthly stipend management for active interns</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="payments-toolbar">
        <div className="search-box">
          <IconSearch size={18} />

          <input
            type="text"
            placeholder="Search internship or student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="payments-table-wrapper">
        <div className="payments-job-groups">
          {Object.entries(
            filteredInternships.reduce((acc, internship) => {
              if (!acc[internship.job_title]) {
                acc[internship.job_title] = [];
              }

              acc[internship.job_title].push(internship);

              return acc;
            }, {}),
          ).map(([jobTitle, students]) => (
            <div key={jobTitle} className="job-group-card">
              {/* JOB HEADER */}
              <div className="job-group-header">
                <h2>{jobTitle}</h2>

                <span>{students.length} Interns</span>
              </div>

              {/* TABLE */}
              <div className="job-table-wrapper">
                <table className="job-payment-table">
                  <thead>
                    <tr>
                      <th>Student</th>

                      <th>Progress</th>

                      {students[0]?.months?.map((month) => (
                        <th key={month.month}>Month {month.month}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr key={student.internship_id}>
                        {/* STUDENT */}
                        <td>
                          <div className="student-info">
                            {/* <div className="student-avatar">

                              {
                                student.student_name
                                  ?.charAt(0)
                              }

                            </div> */}

                            <div>
                              <h4>{student.student_name}</h4>

                              <p>{student.student_email}</p>
                            </div>
                          </div>
                        </td>

                        {/* PROGRESS */}
                        <td>
                          <div className="progress-cell">
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

                        {/* MONTHS */}
                        {student.months.map((monthData) => (
                          <td key={monthData.month}>
                            {monthData.payment_done ? (
                              <button className="paid-btn" disabled>
                                Paid
                              </button>
                            ) : monthData.assignment_completed ? (
                              <button
                                className="pay-btn"
                                onClick={() =>
                                  handlePayNow(
                                    student.internship_id,
                                    monthData.month,
                                    student.stipend,
                                  )
                                }
                              >
                                Pay
                              </button>
                            ) : (
                              <button className="disabled-btn" disabled>
                                Pending
                              </button>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
