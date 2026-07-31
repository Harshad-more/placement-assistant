const express = require("express");
const db = require("../db");

const router = express.Router();

// ================= GET ALL RESOURCES =================

router.get("/resources", (req, res) => {
  db.query(
    "SELECT * FROM resources ORDER BY subject, title",
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

module.exports = router;