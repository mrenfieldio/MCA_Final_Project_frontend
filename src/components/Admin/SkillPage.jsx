import { useState } from "react";
import { SectionHeader, Modal, InputField, SelectField } from "./AdminShared";

export default function SkillsPage({ skills: initialSkills, skillCategories }) {
  const [skills, setSkills] = useState(initialSkills);
  const [search,    setSearch]    = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState({ name: "", category: "Frontend" });

  const filtered = skills.filter(s =>
    (catFilter === "All" || s.category === catFilter) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const maxCount = Math.max(...skills.map(s => s.count));

  const handleAdd = () => {
    if (!form.name.trim()) return;
    setSkills(prev => [...prev, { id: Date.now(), ...form, count: 0 }]);
    setForm({ name: "", category: "Frontend" });
    setShowModal(false);
  };

  return (
    <div>
      <SectionHeader
        title="Skills Catalog"
        subtitle="Skills users can tag on profiles and job listings"
        action="Add Skill"
        onAction={() => setShowModal(true)}
      />

      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="Search skills…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {(skillCategories || ["All","Frontend","Backend","AI/ML","Mobile","DevOps","Database","API"]).map(c => (
          <button
            key={c}
            className={`filter-btn ${catFilter === c ? "active" : ""}`}
            onClick={() => setCatFilter(c)}
          >{c}</button>
        ))}
      </div>

      <div className="skills-grid">
        {filtered.map(s => (
          <div key={s.id} className="skill-card">
            <div className="skill-card-body">
              <div className="skill-card-top">
                <span className="skill-name">{s.name}</span>
                <span className="skill-count">{s.count.toLocaleString()} users</span>
              </div>
              <div className="skill-track">
                <div className="skill-fill" style={{ width: `${(s.count / maxCount) * 100}%` }} />
              </div>
              <span className="skill-cat-badge">{s.category}</span>
            </div>
            <button
              className="skill-remove-btn"
              onClick={() => setSkills(p => p.filter(x => x.id !== s.id))}
            >✕</button>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Add Skill" onClose={() => setShowModal(false)}>
          <InputField label="Skill Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="e.g. React.js" />
          <SelectField
            label="Category"
            value={form.category}
            onChange={v => setForm(p => ({ ...p, category: v }))}
            options={["Frontend","Backend","AI/ML","Mobile","DevOps","Database","API"]}
          />
          <button className="btn-submit" onClick={handleAdd}>Add to Catalog</button>
        </Modal>
      )}
    </div>
  );
}