import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Briefcase,
  CheckCircle,
  Star,
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  ExternalLink,
  Send,
  Download,
  Eye,
} from "lucide-react";

export default function JobDetailsModal({ job, isOpen, onClose, onApply }) {
  const [applicationStep, setApplicationStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
    portfolio: "",
  });
  const [existingResume, setExistingResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Auto-fetch student profile when modal opens
  useEffect(() => {
    if (isOpen && applicationStep === 2) {
      fetchStudentProfile();
    }
  }, [isOpen, applicationStep]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      // Validate file type
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, DOC, and DOCX files are allowed");
        return;
      }
      
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const fetchStudentProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/student/profile/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // Store existing resume URL
      if (data.resume) {
        setExistingResume(data.resume);
      }

      setFormData((prev) => ({
        ...prev,
        fullName: data.name || data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        portfolio: data.portfolio || "",
      }));
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleViewResume = () => {
    if (existingResume) {
      window.open(existingResume, "_blank");
    }
  };

  const handleDownloadResume = () => {
    if (existingResume) {
      const link = document.createElement("a");
      link.href = existingResume;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const token = localStorage.getItem("token");

    const submitData = new FormData();

    // 🔥 IMPORTANT: match backend field names
    submitData.append("job", job.id);
    submitData.append("full_name", formData.fullName);
    submitData.append("email", formData.email);
    submitData.append("phone", formData.phone);
    submitData.append("cover_letter", formData.coverLetter);
    submitData.append("portfolio", formData.portfolio);

    // ✅ Only send file if new file uploaded
    if (formData.resume instanceof File) {
      submitData.append("resume", formData.resume);
    }

    
    const response = await fetch(
      "http://localhost:8000/api/student/apply-job/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      }
    );

    const data = await response.json();
    console.log(data,"applied jobs");
    

    if (!response.ok) {
      throw new Error(data.error || "Application failed");
    }

    // ✅ SUCCESS
    setSubmitted(true);
    setIsSubmitting(false);

    if (onApply) {
      onApply(job);
    }

    // 🔄 RESET AFTER SUCCESS
    setTimeout(() => {
      setSubmitted(false);
      setApplicationStep(1);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
        resume: null,
        portfolio: "",
      });

      setExistingResume(null);
      onClose();
    }, 2000);

  } catch (error) {
    console.error("Error submitting application:", error);
    alert(error.message || "Failed to submit application");
    setIsSubmitting(false);
  }
};

  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="job-modal">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {!submitted ? (
          <>
            {/* Job Details Section */}
            {applicationStep === 1 && (
              <>
                <div className="modal-header">
                  <div className="modal-header-info">
                    <h2>{job?.title || "Job Position"}</h2>
                    <p className="modal-company-name">
                      {job?.company || "Company"}
                    </p>
                    <div className="modal-details">
                      <div className="detail-row">
                        <span className="label">Job Type:</span>
                        <span className="value">
                          {job?.job_type || "Full Time"}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="label">Salary:</span>
                        <span className="value">
                          {job?.salary || "Not disclosed"}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="label">Last Date:</span>
                        <span className="value">
                          {job?.deadline
                            ? formatDate(job.deadline)
                            : "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-body">
                  <div className="modal-section">
                    <h3>
                      <MapPin size={18} />
                      Location
                    </h3>
                    <p>{job?.location || "Location not specified"}</p>
                  </div>

                  <div className="modal-section">
                    <h3>
                      <Briefcase size={18} />
                      Job Description
                    </h3>
                    <p>{job?.description || "No description provided."}</p>
                  </div>

                  {job?.requirements && job.requirements.length > 0 && (
                    <div className="modal-section">
                      <h3>
                        <CheckCircle size={18} />
                        Requirements
                      </h3>
                      <ul className="requirements-list">
                        {job.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job?.responsibilities && job.responsibilities.length > 0 && (
                    <div className="modal-section">
                      <h3>
                        <Star size={18} />
                        Responsibilities
                      </h3>
                      <ul className="responsibilities-list">
                        {job.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn-secondary" onClick={onClose}>
                    Close
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => setApplicationStep(2)}
                  >
                    Apply Now
                    <Send size={16} />
                  </button>
                </div>
              </>
            )}

            {/* Application Form Section */}
            {applicationStep === 2 && (
              <>
                <div className="modal-header">
                  <h2>Apply for {job?.title}</h2>
                  <p className="modal-subtitle">
                    at {job?.company} • {job?.location}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="application-form">
                  <div className="form-group">
                    <label>
                      <User size={16} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Mail size={16} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Phone size={16} />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <FileText size={16} />
                      Cover Letter
                    </label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Why are you interested in this position? What makes you a great candidate?"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Upload size={16} />
                      Resume/CV *
                    </label>

                    {isLoadingProfile && (
                      <div className="loading-resume">
                        <p>Loading your resume...</p>
                      </div>
                    )}

                    {!isLoadingProfile && existingResume && (
                      <div className="existing-resume">
                        <p className="resume-label">Your existing resume:</p>
                        <div className="resume-actions">
                          <button
                            type="button"
                            className="resume-action-btn"
                            onClick={handleViewResume}
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            type="button"
                            className="resume-action-btn"
                            onClick={handleDownloadResume}
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                        <p className="upload-hint">
                          Or upload a new resume (this will replace your existing one)
                        </p>
                      </div>
                    )}

                    <div className="file-upload">
                      <input
                        type="file"
                        name="resume"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="file-input"
                      />
                      <div className="file-upload-icon">
                        <Upload size={24} />
                      </div>
                      <p className="file-hint">
                        {existingResume 
                          ? "Click or drag to upload new resume (PDF, DOC, DOCX - Max 5MB)"
                          : "Upload your resume (PDF, DOC, DOCX - Max 5MB)"}
                      </p>
                    </div>

                    {formData.resume && formData.resume instanceof File && (
                      <div className="selected-file">
                        <p>Selected file: {formData.resume.name}</p>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                          className="remove-file"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      <ExternalLink size={16} />
                      Portfolio/Website (Optional)
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setApplicationStep(1)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                      {!isSubmitting && <Send size={16} />}
                    </button>
                  </div>
                </form>
              </>
            )}
          </>
        ) : (
          <div className="success-state">
            <div className="success-icon">
              <CheckCircle size={64} color="#10B981" />
            </div>
            <h2>Application Submitted!</h2>
            <p>
              Thank you for applying to {job?.title} at {job?.company}.
              <br />
              The hiring team will review your application and get back to you
              soon.
            </p>
            <button className="btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
}