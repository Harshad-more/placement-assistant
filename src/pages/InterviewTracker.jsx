import { useEffect, useState } from "react";
import axios from "axios";

function InterviewTracker() {
  const [questions, setQuestions] =
    useState([]);

  const [company, setCompany] =
    useState("All");

  const [formData, setFormData] =
    useState({
      company_name: "",
      question: "",
      status: "Pending",
    });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions =
    async () => {
      try {
        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        const res =
          await axios.get(
            `https://placement-assistant-production.up.railway.app/api/interview/${user.id}`
          );

        setQuestions(res.data);
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

        await axios.post(
          "https://placement-assistant-production.up.railway.app/api/interview",
          {
            ...formData,
            user_id: user.id,
          }
        );

        setFormData({
          company_name: "",
          question: "",
          status: "Pending",
        });

        fetchQuestions();
      } catch (error) {
        console.log(error);
      }
    };

  const handleDelete =
    async (id) => {
      await axios.delete(
        `https://placement-assistant-production.up.railway.app/api/interview/${id}`
      );

      fetchQuestions();
    };

  const handleStatusChange =
    async (id, status) => {
      await axios.put(
        `https://placement-assistant-production.up.railway.app/api/interview/${id}`,
        { status }
      );

      fetchQuestions();
    };

  const companies = [
    "All",
    ...new Set(
      questions.map(
        (q) =>
          q.company_name
      )
    ),
  ];

  const filteredQuestions =
    questions.filter(
      (q) =>
        company === "All" ||
        q.company_name ===
          company
    );

  return (
    <div className="container">
      <h1>
        Interview Tracker
      </h1>

      <div className="card">
        <form
          onSubmit={
            handleSubmit
          }
        >
          <input
            type="text"
            name="company_name"
            placeholder="Company"
            value={
              formData.company_name
            }
            onChange={
              handleChange
            }
            required
          />

          <textarea
            name="question"
            placeholder="Interview Question"
            value={
              formData.question
            }
            onChange={
              handleChange
            }
            rows="4"
            required
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
              Pending
            </option>
            <option>
              Practiced
            </option>
            <option>
              Mastered
            </option>
          </select>

          <button className="btn">
            Add Question
          </button>
        </form>
      </div>

      <div className="card">
        <select
          value={company}
          onChange={(e) =>
            setCompany(
              e.target.value
            )
          }
        >
          {companies.map((c) => (
            <option key={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filteredQuestions.map(
        (q) => (
          <div
            className="card"
            key={q.id}
          >
            <h3>
              {
                q.company_name
              }
            </h3>

            <p>
              {q.question}
            </p>

            <select
              value={
                q.status
              }
              onChange={(
                e
              ) =>
                handleStatusChange(
                  q.id,
                  e.target
                    .value
                )
              }
            >
              <option>
                Pending
              </option>
              <option>
                Practiced
              </option>
              <option>
                Mastered
              </option>
            </select>

            <br />
            <br />

            <button
              className="btn"
              onClick={() =>
                handleDelete(
                  q.id
                )
              }
            >
              Delete
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default InterviewTracker;