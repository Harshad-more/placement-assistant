const express = require("express");
const cors = require("cors");
const db = require("./db");
const multer = require("multer");
const path = require("path");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// Makes uploaded files accessible in browser
app.use("/uploads", express.static("uploads"));

// ================= MULTER CONFIGURATION =================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({
  storage,
});

// ================= TEST ROUTE =================

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working successfully!",
  });
});

// ================= USER REGISTER =================

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  const sql =
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message:
          "Email already exists or registration failed",
      });
    }

    res.json({
      message: "Registration successful",
    });
  });
});

// ================= USER LOGIN =================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user: result[0],
    });
  });
});
// ================= APPLICATION ROUTES =================

// Get applications of logged-in user
app.get("/api/applications/:userId", (req, res) => {
  const { userId } = req.params;

  const sql =
    "SELECT * FROM applications WHERE user_id = ? ORDER BY id DESC";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error fetching applications",
      });
    }

    res.json(result);
  });
});

// Add application
app.post("/api/applications", (req, res) => {
  const {
    company_name,
    role,
    applied_date,
    deadline_date,
    status,
    user_id,
    notes,
  } = req.body;

  const sql =
    "INSERT INTO applications (company_name, role, applied_date, deadline_date, status, user_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [
      company_name,
      role,
      applied_date,
      deadline_date,
      status,
      user_id,
      notes || "",
    ],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Error adding application",
        });
      }

      res.json({
        message: "Application added successfully",
      });
    }
  );
});

// Update application status
app.put("/api/applications/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql =
    "UPDATE applications SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Error updating application",
      });
    }

    res.json({
      message: "Application updated successfully",
    });
  });
});

// Delete application
app.delete("/api/applications/:id", (req, res) => {
  const { id } = req.params;

  const sql =
    "DELETE FROM applications WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Error deleting application",
      });
    }

    res.json({
      message: "Application deleted successfully",
    });
  });
});
// ================= RESOURCES =================

app.get("/api/resources", (req, res) => {
  const sql =
    "SELECT * FROM resources ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message:
          "Error fetching resources",
      });
    }

    res.json(result);
  });
});
// ================= RESUME UPLOAD =================

app.post(
  "/api/resume",
  upload.single("resume"),
  (req, res) => {
    const user_id = req.body.user_id;

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a file",
      });
    }

    const resume_name =
      req.file.originalname;

    const resume_path =
      req.file.filename;

    const sql =
      "INSERT INTO resumes (user_id, resume_name, resume_path) VALUES (?, ?, ?)";

    db.query(
      sql,
      [
        user_id,
        resume_name,
        resume_path,
      ],
      (err) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message:
              "Error uploading resume",
          });
        }

        res.json({
          message:
            "Resume uploaded successfully",
        });
      }
    );
  }
);

// ================= GET LATEST RESUME =================

app.get(
  "/api/resume/:userId",
  (req, res) => {
    const { userId } = req.params;

    const sql =
      "SELECT * FROM resumes WHERE user_id = ? ORDER BY id DESC LIMIT 1";

    db.query(
      sql,
      [userId],
      (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message:
              "Error fetching resume",
          });
        }

        if (result.length === 0) {
          return res.json(null);
        }

        res.json(result[0]);
      }
    );
  }
);
// ================= INTERVIEW TRACKER =================

// Get all questions of logged-in user
app.get("/api/interview/:userId", (req, res) => {
  const { userId } = req.params;

  const sql =
    "SELECT * FROM interview_questions WHERE user_id = ? ORDER BY id DESC";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Error fetching questions",
      });
    }

    res.json(result);
  });
});

// Add question
app.post("/api/interview", (req, res) => {
  const {
    user_id,
    company_name,
    question,
    status,
  } = req.body;

  const sql =
    "INSERT INTO interview_questions (user_id, company_name, question, status) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [
      user_id,
      company_name,
      question,
      status,
    ],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Error adding question",
        });
      }

      res.json({
        message:
          "Question added successfully",
      });
    }
  );
});

// Update status
app.put("/api/interview/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql =
    "UPDATE interview_questions SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message:
          "Error updating status",
      });
    }

    res.json({
      message:
        "Status updated successfully",
    });
  });
});

// Delete question
app.delete("/api/interview/:id", (req, res) => {
  const { id } = req.params;

  const sql =
    "DELETE FROM interview_questions WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message:
          "Error deleting question",
      });
    }

    res.json({
      message:
        "Question deleted successfully",
    });
  });
});
// ================= ATS RESUME ANALYZER =================

// ================= ATS RESUME ANALYZER =================

app.post(
  "/api/analyze-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      console.log("===== ATS ANALYZER HIT =====");
      console.log("Uploaded File:", req.file);

      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a resume",
        });
      }

      // Only allow PDF
      if (
        req.file.mimetype !==
        "application/pdf"
      ) {
        fs.unlinkSync(req.file.path);

        return res.status(400).json({
          message:
            "Only PDF files are supported.",
        });
      }

      const dataBuffer =
        fs.readFileSync(req.file.path);

      const pdfData =
        await pdfParse(dataBuffer);

      const text =
        pdfData.text.toLowerCase();

      const jobDescription =
        req.body.jobDescription
          ? req.body.jobDescription.toLowerCase()
          : "";

      let score = 0;
let suggestions = [];

// ================= CONTACT INFO =================

const emailRegex =
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

const phoneRegex =
  /(\+91)?[6-9]\d{9}/;

if (emailRegex.test(text)) {
  score += 5;
} else {
  suggestions.push(
    "Add email address."
  );
}

if (phoneRegex.test(text)) {
  score += 5;
} else {
  suggestions.push(
    "Add phone number."
  );
}

if (text.includes("linkedin")) {
  score += 5;
} else {
  suggestions.push(
    "Add LinkedIn profile."
  );
}

if (
  text.includes("github")
) {
  score += 5;
} else {
  suggestions.push(
    "Add GitHub profile."
  );
}

// ================= SECTIONS =================

const sections = [
  "education",
  "skills",
  "project",
  "experience",
  "certification",
];

sections.forEach((section) => {
  if (text.includes(section)) {
    score += 5;
  } else {
    suggestions.push(
      `Add ${section} section.`
    );
  }
});

// ================= SKILLS =================

const defaultSkills = [
  "java",
  "sql",
  "mysql",
  "react",
  "node",
  "javascript",
  "html",
  "css",
  "git",
  "spring boot",
  "rest api",
  "mongodb",
  "python",
  "c++",
];

let keywords =
  defaultSkills;

if (
  req.body.jobDescription &&
  req.body.jobDescription.trim() !== ""
) {
  keywords =
    req.body.jobDescription
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(
        (word) =>
          word.length > 2
      );
}

const foundSkills = [];
const missingSkills = [];

keywords.forEach((skill) => {
  if (
    text.includes(
      skill.toLowerCase()
    )
  ) {
    foundSkills.push(skill);
    score += 3;
  } else {
    missingSkills.push(skill);
  }
});

// ================= ACTION VERBS =================

const actionWords = [
  "developed",
  "designed",
  "implemented",
  "built",
  "created",
  "optimized",
  "managed",
];

let actionCount = 0;

actionWords.forEach((word) => {
  if (text.includes(word)) {
    actionCount++;
  }
});

score += actionCount * 2;

if (actionCount < 3) {
  suggestions.push(
    "Use more action verbs like Developed, Designed, Implemented."
  );
}

// ================= FINAL SCORE =================

if (score > 100) {
  score = 100;
}

      res.json({
  atsScore: score,
  foundSkills,
  missingSkills,
  suggestions,
  totalSkills:
    foundSkills.length +
    missingSkills.length,
});
    } catch (error) {
  console.error("ATS ERROR FULL:");
  console.error(error);
  console.error(error.message);
  console.error(error.stack);

  res.status(500).json({
    message: error.message,
  });
}
  }
);
// ================= STUDY PLANNER =================

// Get all tasks
app.get("/api/planner/:userId", (req, res) => {
  const { userId } = req.params;

  const sql =
    "SELECT * FROM planner WHERE user_id = ? ORDER BY id DESC";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Error fetching tasks",
      });
    }

    res.json(result);
  });
});

// Add task
app.post("/api/planner", (req, res) => {
  const {
    task,
    task_date,
    status,
    user_id,
  } = req.body;

  const sql =
    "INSERT INTO planner (task, task_date, status, user_id) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [task, task_date, status, user_id],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Error adding task",
        });
      }

      res.json({
        message: "Task added successfully",
      });
    }
  );
});

// Update task status
app.put("/api/planner/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql =
    "UPDATE planner SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Error updating task",
      });
    }

    res.json({
      message: "Task updated successfully",
    });
  });
});

// Delete task
app.delete("/api/planner/:id", (req, res) => {
  const { id } = req.params;

  const sql =
    "DELETE FROM planner WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Error deleting task",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  });
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});