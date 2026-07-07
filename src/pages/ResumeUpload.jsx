import { useEffect, useState } from "react";
import axios from "axios";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await axios.get(
        `https://placement-assistant-production.up.railway.app/api/resume/${user.id}`
      );

      setResume(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume.");
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);
    formData.append("user_id", user.id);

    try {
      await axios.post(
        "https://placement-assistant-production.up.railway.app/api/resume",
        formData
      );

      alert("Resume uploaded successfully!");

      fetchResume();
      setFile(null);
    } catch (error) {
      console.log(error);
      alert("Upload failed.");
    }
  };

  return (
    <div>
      <h1>Resume Upload</h1>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <br />
        <br />

        <button type="submit">
          Upload Resume
        </button>
      </form>

      <hr />

      <h2>Latest Resume</h2>

      {resume ? (
        <div>
          <p>
            <b>File:</b>{" "}
            {resume.resume_name}
          </p>

          <a
            href={`https://placement-assistant-production.up.railway.app/uploads/${resume.resume_path}`}
            target="_blank"
            rel="noreferrer"
          >
            View Resume
          </a>
        </div>
      ) : (
        <p>No resume uploaded.</p>
      )}
    </div>
  );
}

export default ResumeUpload;