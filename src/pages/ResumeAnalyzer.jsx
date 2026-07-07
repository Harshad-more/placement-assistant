import { useState } from "react";
import axios from "axios";

function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] =
    useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload a resume.");
      return;
    }

    const formData = new FormData();

    formData.append("resume", resume);
    formData.append(
      "jobDescription",
      jobDescription
    );

    try {
      setLoading(true);

      const res = await axios.post(
        "https://placement-assistant-production.up.railway.app/api/analyze-resume",
        formData
      );

      setResult(res.data);
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Error analyzing resume"
      );
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>AI Resume Analyzer</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setResume(
                e.target.files[0]
              )
            }
          />

          <textarea
            placeholder="Paste Job Description (Optional)"
            rows="8"
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(
                e.target.value
              )
            }
          />

          <button
            className="btn"
            type="submit"
          >
            Analyze Resume
          </button>
        </form>
      </div>

      {loading && (
        <p>Analyzing Resume...</p>
      )}

      {result && (
        <div className="card">
          <h2>
            ATS Score:
            {result.atsScore}/100
          </h2>

          <h3>Found Skills</h3>

          <ul>
            {result.foundSkills.map(
              (skill, index) => (
                <li key={index}>
                  ✅ {skill}
                </li>
              )
            )}
          </ul>

          <h3>Missing Skills</h3>

          <ul>
            {result.missingSkills.map(
              (skill, index) => (
                <li key={index}>
                  ❌ {skill}
                </li>
              )
            )}
          </ul>

          <h3>Suggestions</h3>

          <ul>
            {result.suggestions.map(
              (item, index) => (
                <li key={index}>
                  ⚠️ {item}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;