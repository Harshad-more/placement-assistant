const express = require("express");
const db = require("../db");

const router = express.Router();

// ================= GET ALL TASKS =================

router.get("/planner/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT * FROM planner WHERE user_id=? ORDER BY id DESC",
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

// ================= ADD TASK =================

router.post("/planner", (req, res) => {
  const {
    task,
    task_date,
    status,
    user_id,
  } = req.body;

  db.query(
    `INSERT INTO planner
    (task, task_date, status, user_id)
    VALUES (?, ?, ?, ?)`,
    [
      task,
      task_date,
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
        message: "Task Added Successfully",
      });
    }
  );
});

// ================= UPDATE TASK =================

router.put("/planner/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE planner SET status=? WHERE id=?",
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
        message: "Task Updated Successfully",
      });
    }
  );
});

// ================= DELETE TASK =================

router.delete("/planner/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM planner WHERE id=?",
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
        message: "Task Deleted Successfully",
      });
    }
  );
});

module.exports = router;