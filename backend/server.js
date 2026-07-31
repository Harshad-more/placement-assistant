require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// ================= DATABASE =================

require("./db");

// ================= ROUTES =================

const authRoutes = require("./routes/auth");
const applicationRoutes = require("./routes/applications");
const plannerRoutes = require("./routes/planner");
const interviewRoutes = require("./routes/interview");
const resumeRoutes = require("./routes/resume");
const resourceRoutes = require("./routes/resources");
const resumeAnalyzerRoutes = require("./routes/resumeAnalyzer");

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC =================

app.use("/uploads", express.static("uploads"));

// ================= HOME =================

app.get("/", (req, res) => {
  res.send("Placement Assistant Backend Running");
});

// ================= TEST =================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend Working Successfully",
  });
});

// ================= API ROUTES =================

app.use("/api", authRoutes);
app.use("/api", applicationRoutes);
app.use("/api", plannerRoutes);
app.use("/api", interviewRoutes);
app.use("/api", resumeRoutes);
app.use("/api", resourceRoutes);
app.use("/api", resumeAnalyzerRoutes);
// ================= INVALID ROUTE =================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});