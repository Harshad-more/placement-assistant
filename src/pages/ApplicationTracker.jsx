import { useEffect, useState } from "react";
import axios from "axios";

function ApplicationTracker() {
  const [applications, setApplications] =
    useState([]);
  const [search, setSearch] =
    useState("");
  const [filterStatus, setFilterStatus] =
    useState("All");

  const [formData, setFormData] =
    useState({
      company_name: "",
      role: "",
      applied_date: "",
      deadline_date: "",
      status: "Applied",
      notes: "",
    });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications =
    async () => {
      try {
        const user = JSON.parse(
          localStorage.getItem("user")
        );

        if (!user) {
          setApplications([]);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/applications/${user.id}`
        );

        setApplications(res.data);
      } catch (error) {
        console.log(error);
      }
    };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        if (!user) {
          alert(
            "Please login first"
          );
          return;
        }

        await axios.post(
          "http://localhost:5000/api/applications",
          {
            ...formData,
            user_id: user.id,
          }
        );

        setFormData({
          company_name: "",
          role: "",
          applied_date: "",
          deadline_date: "",
          status: "Applied",
          notes: "",
        });

        fetchApplications();
      } catch (error) {
        console.log(error);
        alert(
          "Failed to add application"
        );
      }
    };

  const handleDelete =
    async (id) => {
      try {
        await axios.delete(
          `http://localhost:5000/api/applications/${id}`
        );

        fetchApplications();
      } catch (error) {
        console.log(error);
      }
    };

  const handleStatusChange =
    async (id, status) => {
      try {
        await axios.put(
          `http://localhost:5000/api/applications/${id}`,
          { status }
        );

        fetchApplications();
      } catch (error) {
        console.log(error);
      }
    };

  const filteredApplications =
    applications.filter((app) => {
      const matchesSearch =
        app.company_name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        filterStatus === "All" ||
        app.status ===
          filterStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const getReminder = (
    deadline
  ) => {
    if (!deadline) return "";

    const today = new Date();
    const deadlineDate =
      new Date(deadline);

    today.setHours(
      0,
      0,
      0,
      0
    );

    deadlineDate.setHours(
      0,
      0,
      0,
      0
    );

    const diff = Math.ceil(
      (deadlineDate - today) /
        (1000 *
          60 *
          60 *
          24)
    );

    if (diff < 0)
      return "Deadline Passed ❌";

    if (diff === 0)
      return "Deadline Today ⚠️";

    return `${diff} days left ✅`;
  };

  return (
    <div className="container">
      <h1>
        Application Tracker
      </h1>

      <div className="card">
        <h2>
          Add Application
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <input
            type="text"
            name="company_name"
            placeholder="Company Name"
            value={
              formData.company_name
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="role"
            placeholder="Role"
            value={
              formData.role
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="date"
            name="applied_date"
            value={
              formData.applied_date
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="date"
            name="deadline_date"
            value={
              formData.deadline_date
            }
            onChange={
              handleChange
            }
            required
          />

          <textarea
            name="notes"
            placeholder="Add Notes..."
            value={
              formData.notes
            }
            onChange={
              handleChange
            }
            rows="4"
          />

          <select
            name="status"
            value={
              formData.status
            }
            onChange={
              handleChange
            }
          >
            <option>
              Applied
            </option>
            <option>
              Interview
            </option>
            <option>
              Rejected
            </option>
            <option>
              Selected
            </option>
          </select>

          <button
            className="btn"
            type="submit"
          >
            Add Application
          </button>
        </form>
      </div>

      <div className="card">
        <h2>
          Search &
          Filter
        </h2>

        <input
          type="text"
          placeholder="Search by company..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          value={
            filterStatus
          }
          onChange={(e) =>
            setFilterStatus(
              e.target.value
            )
          }
        >
          <option>All</option>
          <option>
            Applied
          </option>
          <option>
            Interview
          </option>
          <option>
            Rejected
          </option>
          <option>
            Selected
          </option>
        </select>
      </div>

      <h2>
        Applications
      </h2>

      {filteredApplications.length ===
      0 ? (
        <p>
          No applications
          found.
        </p>
      ) : (
        filteredApplications.map(
          (app) => (
            <div
              className="card"
              key={app.id}
            >
              <p>
                <b>
                  Company:
                </b>{" "}
                {
                  app.company_name
                }
              </p>

              <p>
                <b>
                  Role:
                </b>{" "}
                {app.role}
              </p>

              <p>
                <b>
                  Applied:
                </b>{" "}
                {app.applied_date?.split(
                  "T"
                )[0]}
              </p>

              <p>
                <b>
                  Deadline:
                </b>{" "}
                {app.deadline_date?.split(
                  "T"
                )[0]}
              </p>

              <p>
                <b>
                  Reminder:
                </b>{" "}
                {getReminder(
                  app.deadline_date
                )}
              </p>

              <p>
                <b>
                  Notes:
                </b>{" "}
                {app.notes ||
                  "No Notes"}
              </p>

              <select
                value={
                  app.status
                }
                onChange={(
                  e
                ) =>
                  handleStatusChange(
                    app.id,
                    e.target
                      .value
                  )
                }
              >
                <option>
                  Applied
                </option>
                <option>
                  Interview
                </option>
                <option>
                  Rejected
                </option>
                <option>
                  Selected
                </option>
              </select>

              <br />
              <br />

              <button
                className="btn"
                onClick={() =>
                  handleDelete(
                    app.id
                  )
                }
              >
                Delete
              </button>
            </div>
          )
        )
      )}
    </div>
  );
}

export default ApplicationTracker;