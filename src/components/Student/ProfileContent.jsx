import { useState, useEffect, useRef } from "react";
import { User, BookOpen, Code, Save, X, Edit2, Camera } from "lucide-react";

export default function ProfileContent({ user, token, refreshProfile }) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const avatarInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user.name || "",
    university: user.university || "",
    phone: user.phone || "",
    bio: user.bio || "",
    major: user.major || "",
    graduation_year: user.graduation_year || "",
    skills: user.skills?.join(", ") || "",
  });

  useEffect(() => {
    setFormData({
      name: user.name || "",
      university: user.university || "",
      phone: user.phone || "",
      bio: user.bio || "",
      major: user.major || "",
      graduation_year: user.graduation_year || "",
      skills: user.skills?.join(", ") || "",
    });
    setAvatarPreview(null);
    setProfilePictureFile(null);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarClick = () => {
    if (editMode) avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const skillsArray = formData.skills
        ? formData.skills
            .replace(/[\[\]"']/g, "")
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [];

      // Use FormData so we can send files + text in one multipart PUT request
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("university", formData.university);
      payload.append("phone", formData.phone);
      payload.append("bio", formData.bio);
      payload.append("major", formData.major);
      if (formData.graduation_year) {
        payload.append("graduation_year", formData.graduation_year);
      }
      // Django view already handles skills as a JSON string
      payload.append("skills", JSON.stringify(skillsArray));

      if (profilePictureFile) {
        payload.append("profile_picture", profilePictureFile);
      }
      if (resumeFile) {
        payload.append("resume", resumeFile);
      }

      const response = await fetch(
        "http://localhost:8000/api/student/profile/",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Update failed");
      }

      setEditMode(false);
      setAvatarPreview(null);
      setProfilePictureFile(null);
      setResumeFile(null);
      await refreshProfile();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setAvatarPreview(null);
    setProfilePictureFile(null);
    setResumeFile(null);
    setFormData({
      name: user.name || "",
      university: user.university || "",
      phone: user.phone || "",
      bio: user.bio || "",
      major: user.major || "",
      graduation_year: user.graduation_year || "",
      skills: user.skills?.join(", ") || "",
    });
  };

  const BASE_URL = "http://localhost:8000";

  const toMediaUrl = (path) => {
    if (!path) return null;

    // already full URL
    if (path.startsWith("http")) return path;

    // if path already has /media/, just prepend the base url
    if (path.startsWith("/media/")) {
      return BASE_URL + path;
    }

    // remove leading slash if exists
    if (path.startsWith("/")) {
      path = path.slice(1);
    }

    return BASE_URL + "/media/" + path;
  };


  const displayAvatar =
    avatarPreview ||
    (user.profile_picture ? toMediaUrl(user.profile_picture) : null);
  const initials = user.name?.charAt(0) || user.email?.charAt(0) || "?";

  

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-section">
          <div
            className={`avatar-wrapper ${editMode ? "editable" : ""}`}
            onClick={handleAvatarClick}
          >
            {displayAvatar ? (
              <img src={displayAvatar} alt="profile" className="avatar-img" />
            ) : (
              <span className="avatar-initials">{initials}</span>
            )}
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>

        <div className="profile-info">
          <h1>{user.name || "Add Your Name"}</h1>
          <p className="email">{user.email}</p>
          {user.bio && <p className="bio">{user.bio}</p>}
          <div className="profile-actions">
            {!editMode ? (
              <button className="btn-primary" onClick={() => setEditMode(true)}>
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="action-buttons">
                <button
                  className="btn-save"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button className="btn-cancel" onClick={handleCancel}>
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-form">
        <div className="form-section">
          <h3>
            <User size={18} />
            Personal Information
          </h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Your full name"
              />
            </div>
            <div className="form-field">
              <label>Phone Number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="form-field full-width">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!editMode}
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>
            <BookOpen size={18} />
            Education
          </h3>
          <div className="form-grid">
            <div className="form-field full-width">
              <label>University</label>
              <input
                name="university"
                value={formData.university}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="University name"
              />
            </div>
            <div className="form-field">
              <label>Highest Degree</label>
              <input
                name="major"
                value={formData.major}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Computer Science, Engineering, etc."
              />
            </div>
            <div className="form-field">
              <label>Graduation Year</label>
              <input
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="2024, 2025, etc."
                type="number"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>
            <Code size={18} />
            Skills & Expertise
          </h3>
          <div className="form-field">
            <label>Skills (comma separated)</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="React, Python, Django, SQL, etc."
            />
            {user.skills && user.skills.length > 0 && !editMode && (
              <div className="skills-tags">
                {user.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Documents</h3>
          <div className="form-field">
            <label>Resume / CV</label>
            {editMode ? (
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0] || null)}
              />
            ) : user.resume ? (
              <a
                href={toMediaUrl(user.resume)}
                target="_blank"
                rel="noopener noreferrer"
                className="doc-link"
              >
                View Resume
              </a>
            ) : (
              <span className="no-doc">No resume uploaded</span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .profile-container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .profile-header { background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px; display: flex; gap: 32px; align-items: center; border: 1px solid #E5E7EB; }
        .avatar-section { flex-shrink: 0; }
        .avatar-wrapper { position: relative; width: 100px; height: 100px; border-radius: 50%; background: #4F46E5; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: default; transition: box-shadow 0.2s; }
        .avatar-wrapper.editable { cursor: pointer; }
        .avatar-wrapper.editable:hover .avatar-overlay { opacity: 1; }
        .avatar-wrapper.editable:hover { box-shadow: 0 0 0 3px #4F46E5; }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .avatar-initials { font-size: 40px; font-weight: 600; color: white; user-select: none; }
        .avatar-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.52); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; opacity: 0; transition: opacity 0.2s; border-radius: 50%; }
        .avatar-overlay span { font-size: 11px; color: white; font-weight: 600; letter-spacing: 0.04em; }
        .profile-info { flex: 1; }
        .profile-info h1 { font-size: 24px; font-weight: 600; color: #111827; margin-bottom: 6px; }
        .profile-info .email { font-size: 14px; color: #6B7280; margin-bottom: 8px; }
        .profile-info .bio { font-size: 14px; color: #4B5563; line-height: 1.5; }
        .profile-actions { margin-top: 16px; }
        .btn-primary { background: #4F46E5; color: white; border: none; padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s; }
        .btn-primary:hover { background: #4338CA; }
        .action-buttons { display: flex; gap: 12px; }
        .btn-save { background: #10B981; color: white; border: none; padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s; }
        .btn-save:hover:not(:disabled) { background: #059669; }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-cancel { background: white; color: #6B7280; border: 1px solid #E5E7EB; padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
        .btn-cancel:hover { background: #F9FAFB; }
        .profile-form { background: white; border-radius: 16px; border: 1px solid #E5E7EB; overflow: hidden; }
        .form-section { padding: 24px; border-bottom: 1px solid #E5E7EB; }
        .form-section:last-child { border-bottom: none; }
        .form-section h3 { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field.full-width { grid-column: span 2; }
        .form-field label { font-size: 13px; font-weight: 500; color: #6B7280; }
        .form-field input, .form-field textarea { padding: 10px 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; font-family: inherit; transition: border-color 0.15s; }
        .form-field input:focus, .form-field textarea:focus { outline: none; border-color: #4F46E5; }
        .form-field input:disabled, .form-field textarea:disabled { background: #F9FAFB; color: #111827; }
        .skills-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .skill-tag { background: #EEF2FF; color: #4F46E5; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .doc-link { color: #4F46E5; font-size: 14px; text-decoration: underline; }
        .no-doc { color: #9CA3AF; font-size: 14px; }
        @media (max-width: 768px) {
          .profile-header { flex-direction: column; text-align: center; align-items: center; }
          .form-grid { grid-template-columns: 1fr; }
          .form-field.full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
