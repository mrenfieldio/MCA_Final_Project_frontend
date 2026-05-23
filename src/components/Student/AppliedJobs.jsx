import { useEffect, useState } from "react";

import { useNavigate }
from "react-router-dom";

import JobModal from "./JobModal";

import {
  getTimeAgo
} from "../../utils/TimeFormat";

export default function AppliedJobsContent({

  appliedJobs = [],

  savedJobs = [],

}) {

  const navigate = useNavigate();

  // =====================================
  // STATES
  // =====================================

  const [activeTab, setActiveTab] =
    useState("applied");

  const [selectedJob,
  setSelectedJob] =
    useState(null);

  const [showModal,
  setShowModal] =
    useState(false);

  // =====================================
  // INTERVIEW FILTER
  // =====================================

  const interviewJobs =
    appliedJobs.filter(
      (item) =>
        item.status === "interview" ||
        item.status === "shortlisted",
    );



  // =====================================
  // TAB DATA
  // =====================================

  const getJobs = () => {

    if (activeTab === "applied")
      return appliedJobs;

    if (activeTab === "saved")
      return savedJobs;

    if (activeTab === "interview")
      return interviewJobs;

    return [];
  };

  const jobsToShow = getJobs();

  return (

    <div className="applied-jobs-content">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="section-header">

        <h2>
          My Jobs
        </h2>

      </div>

      {/* ================================= */}
      {/* TABS */}
      {/* ================================= */}

      <div className="tabs">

        {/* APPLIED */}
        <button
          className={
            activeTab === "applied"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("applied")
          }
        >

          Applied (
          {appliedJobs.length}
          )

        </button>

        {/* SAVED */}
        <button
          className={
            activeTab === "saved"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("saved")
          }
        >

          Saved (
          {savedJobs.length}
          )

        </button>

      </div>

      {/* ================================= */}
      {/* EMPTY STATE */}
      {/* ================================= */}

      {jobsToShow.length === 0 ? (

        <div className="empty-state">

          <p>
            No jobs found in this section.
          </p>

        </div>

      ) : (

        <div className="applications-list">

          {jobsToShow.map((item) => {

            // =================================
            // DIFFERENT DATA STRUCTURE
            // =================================

            const job = item.job || item;

            return (

              <div
                key={
                  item.id || job.id
                }
                className="application-card"
              >

                {/* ================================= */}
                {/* JOB INFO */}
                {/* ================================= */}

                <div className="application-info">

                  <h3>
                    {job?.title}
                  </h3>

                  <p>
                    {job?.company}
                  </p>

                  {/* META */}
                  <div className="application-meta">

                    {/* DATE */}
                    {
                      (
                        item.applied_at ||
                        item.saved_at ||
                        job.created_at
                      ) && (

                        <span className="applied-date">

                          {
                            item.applied_at

                              ? `Applied: ${getTimeAgo(item.applied_at)}`

                              : item.saved_at

                              ? `Saved: ${getTimeAgo(item.saved_at)}`

                              : `Posted: ${getTimeAgo(job.created_at)}`
                          }

                        </span>
                      )
                    }

                    {/* STATUS */}
                    {
                      item.status && (

                        <span
                          className={`status-badge status-${item.status}`}
                        >

                          {item.status}

                        </span>
                      )
                    }

                  </div>



                  {/* ================================= */}
                  {/* ASSESSMENT */}
                  {/* ================================= */}

                  {
                    item.status ===
                      "assessment" &&
                    item.assessment_link && (

                      <a
                        href={
                          item.assessment_link
                        }
                        target="_blank"
                        className="action-link"
                      >

                        Start Assessment

                      </a>
                    )
                  }

                  {/* ================================= */}
                  {/* INTERVIEW */}
                  {/* ================================= */}

                  {
                    item.status ===
                      "interview" &&
                    item.interview_date && (

                      <p className="interview-date">

                        Interview:

                        {" "}

                        {
                          new Date(
                            item.interview_date
                          ).toLocaleString()
                        }

                      </p>
                    )
                  }

                </div>

                {/* ================================= */}
                {/* NORMAL VIEW DETAILS */}
                {/* ================================= */}

                <button
                  className="view-details-btn"
                  onClick={() => {

                    setSelectedJob(job);

                    setShowModal(true);

                  }}
                >

                  View Details

                </button>

              </div>

            );
          })}
        </div>
      )}

      {/* ================================= */}
      {/* MODAL */}
      {/* ================================= */}

      {
        showModal &&
        selectedJob && (

          <JobModal
            job={selectedJob}

            isOpen={true}

            onClose={() => {

              setSelectedJob(null);

              setShowModal(false);

            }}
          />
        )
      }

    </div>
  );
}