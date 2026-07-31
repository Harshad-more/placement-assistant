const express = require("express");
const db = require("../db");

const router = express.Router();

// ================= GET ALL QUESTIONS =================

router.get("/interview/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT * FROM interview_questions WHERE user_id=? ORDER BY id DESC",
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json(result);
    }
  );
});

// ================= ADD QUESTION =================

router.post("/interview", (req, res) => {
  const {
    company_name,
    question,
    status,
    user_id,
  } = req.body;

  db.query(
    `INSERT INTO interview_questions
    (company_name, question, status, user_id)
    VALUES (?, ?, ?, ?)`,
    [
      company_name,
      question,
      status,
      user_id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Question Added Successfully",
      });
    }
  );
});

// ================= UPDATE STATUS =================

router.put("/interview/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE interview_questions SET status=? WHERE id=?",
    [status, id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Status Updated Successfully",
      });
    }
  );
});

// ================= DELETE QUESTION =================

router.delete("/interview/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM interview_questions WHERE id=?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Question Deleted Successfully",
      });
    }
  );
});

module.exports = router;