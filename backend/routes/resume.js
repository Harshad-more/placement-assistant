const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../db");

const router = express.Router();

// ================= MULTER =================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

// ================= GET RESUME =================

router.get("/resume/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT * FROM resumes WHERE user_id=? ORDER BY id DESC LIMIT 1",
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.json(null);
      }

      res.json(result[0]);
    }
  );
});

// ================= UPLOAD RESUME =================

router.post(
  "/resume",
  upload.single("resume"),
  (req, res) => {
    const { user_id } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const resume_name = req.file.originalname;

    const resume_path =
      "uploads/" + req.file.filename;

    db.query(
      "INSERT INTO resumes(user_id,resume_name,resume_path) VALUES(?,?,?)",
      [
        user_id,
        resume_name,
        resume_path,
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
          message: "Resume Uploaded Successfully",
        });
      }
    );
  }
);

module.exports = router;