import { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "../components/StatsCard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function Dashboard() {
  const [applications, setApplications] =
    useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) return;

      const res = await axios.get(
        `https://placement-assistant-production.up.railway.app/api/applications/${user.id}`
      );

      setApplications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalApplications =
    applications.length;

  const applied =
    applications.filter(
      (app) =>
        app.status === "Applied"
    ).length;

  const interviews =
    applications.filter(
      (app) =>
        app.status === "Interview"
    ).length;

  const selected =
    applications.filter(
      (app) =>
        app.status === "Selected"
    ).length;

  const rejected =
    applications.filter(
      (app) =>
        app.status === "Rejected"
    ).length;

  const pieData = [
    {
      name: "Applied",
      value: applied,
    },
    {
      name: "Interview",
      value: interviews,
    },
    {
      name: "Selected",
      value: selected,
    },
    {
      name: "Rejected",
      value: rejected,
    },
  ];

  const COLORS = [
    "#3498db",
    "#f39c12",
    "#2ecc71",
    "#e74c3c",
  ];

  return (
    <div className="container">
      <h1>
        Placement Assistant Dashboard
      </h1>

      <div className="stats">
        <StatsCard
          title="Total Applications"
          value={
            totalApplications
          }
        />

        <StatsCard
          title="Applied"
          value={applied}
        />

        <StatsCard
          title="Interviews"
          value={interviews}
        />

        <StatsCard
          title="Selected"
          value={selected}
        />

        <StatsCard
          title="Rejected"
          value={rejected}
        />
      </div>

      <br />

      <div className="card">
        <h2>
          Application Status Analytics
        </h2>

        {totalApplications ===
        0 ? (
          <p>
            No applications
            available.
          </p>
        ) : (
          <PieChart
            width={500}
            height={400}
          >
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={150}
              label
            >
              {pieData.map(
                (
                  entry,
                  index
                ) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </div>
    </div>
  );
}

export default Dashboard;