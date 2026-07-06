import { useEffect, useState } from "react";
import axios from "axios";

function Planner() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [tasks, setTasks] =
    useState([]);
  const [task, setTask] =
    useState("");
  const [taskDate, setTaskDate] =
    useState("");

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/planner/${user.id}`
      );

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (!task || !taskDate) {
      alert(
        "Please fill all fields"
      );
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/planner",
        {
          task,
          task_date: taskDate,
          status: "Pending",
          user_id: user.id,
        }
      );

      setTask("");
      setTaskDate("");

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus =
    async (id, currentStatus) => {
      const newStatus =
        currentStatus ===
        "Pending"
          ? "Completed"
          : "Pending";

      try {
        await axios.put(
          `http://localhost:5000/api/planner/${id}`,
          {
            status: newStatus,
          }
        );

        fetchTasks();
      } catch (error) {
        console.log(error);
      }
    };

  const deleteTask = async (
    id
  ) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/planner/${id}`
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <h2>
        Please login to use Study
        Planner.
      </h2>
    );
  }

  return (
    <div className="container">
      <h1>Study Planner</h1>

      <div className="card">
        <form onSubmit={addTask}>
          <input
            type="text"
            placeholder="Enter Task"
            value={task}
            onChange={(e) =>
              setTask(
                e.target.value
              )
            }
          />

          <input
            type="date"
            value={taskDate}
            onChange={(e) =>
              setTaskDate(
                e.target.value
              )
            }
          />

          <button
            className="btn"
            type="submit"
          >
            Add Task
          </button>
        </form>
      </div>

      <h2>Task History</h2>

      {tasks.length === 0 ? (
        <p>No tasks added.</p>
      ) : (
        tasks.map((t) => (
          <div
            className="card"
            key={t.id}
          >
            <h3>{t.task}</h3>

            <p>
              Date:
              {" "}
              {new Date(
                t.task_date
              ).toLocaleDateString()}
            </p>

            <p>
              Status:
              {" "}
              {t.status}
            </p>

            <button
              className="btn"
              onClick={() =>
                updateStatus(
                  t.id,
                  t.status
                )
              }
            >
              {t.status ===
              "Pending"
                ? "Mark Completed"
                : "Mark Pending"}
            </button>

            {" "}

            <button
              className="btn"
              onClick={() =>
                deleteTask(t.id)
              }
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Planner;