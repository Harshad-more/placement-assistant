import { useEffect, useState } from "react";
import axios from "axios";

function Resources() {
  const [resources, setResources] = useState([]);

  const [subject, setSubject] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [type, setType] = useState("All");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/resources"
      );

      setResources(res.data);
    } catch (error) {
      console.error("Resources Error:", error);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchSubject =
      subject === "All" ||
      resource.subject === subject;

    const matchPlatform =
      platform === "All" ||
      resource.platform === platform;

    const matchType =
      type === "All" ||
      resource.resource_type === type;

    return (
      matchSubject &&
      matchPlatform &&
      matchType
    );
  });

  const subjects = [
    "All",
    ...new Set(resources.map((r) => r.subject)),
  ];

  const platforms = [
    "All",
    ...new Set(resources.map((r) => r.platform)),
  ];

  const types = [
    "All",
    ...new Set(resources.map((r) => r.resource_type)),
  ];

  return (
    <div className="container">
      <h1>Placement Resources</h1>

      <div className="card">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {platforms.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {filteredResources.length === 0 ? (
        <p>No resources found.</p>
      ) : (
        filteredResources.map((resource) => (
          <div className="card" key={resource.id}>
            <h3>{resource.title}</h3>

            <p>
              <b>Subject:</b> {resource.subject}
            </p>

            <p>
              <b>Platform:</b> {resource.platform}
            </p>

            <p>
              <b>Type:</b> {resource.resource_type}
            </p>

            <a
              className="btn"
              href={resource.link}
              target="_blank"
              rel="noreferrer"
            >
              Open Resource
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default Resources;