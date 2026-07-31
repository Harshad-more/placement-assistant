const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/analyze-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Resume is required",
        });
      }

      const pdfBuffer = fs.readFileSync(req.file.path);

      const pdfData = await pdfParse(pdfBuffer);

      const resumeText = pdfData.text.toLowerCase();

      fs.unlinkSync(req.file.path);

      const jobDescription =
        (req.body.jobDescription || "").toLowerCase();

      const skillSet = [
        "java",
        "python",
        "javascript",
        "react",
        "node",
        "express",
        "mysql",
        "mongodb",
        "sql",
        "html",
        "css",
        "bootstrap",
        "git",
        "github",
        "rest api",
        "aws",
        "docker",
        "kubernetes",
        "c++",
        "c",
        "dsa",
        "machine learning",
        "deep learning",
        "nlp"
      ];

      const searchText =
        resumeText + " " + jobDescription;

      const foundSkills = [];

      const missingSkills = [];

      skillSet.forEach((skill) => {
        if (searchText.includes(skill)) {
          foundSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      });

      const atsScore = Math.round(
        (foundSkills.length / skillSet.length) * 100
      );

      const suggestions = [];

      if (atsScore < 50) {
        suggestions.push(
          "Add more technical skills."
        );
      }

      if (!resumeText.includes("project")) {
        suggestions.push(
          "Add Projects section."
        );
      }

      if (!resumeText.includes("education")) {
        suggestions.push(
          "Add Education section."
        );
      }

      if (!resumeText.includes("experience")) {
        suggestions.push(
          "Add Experience or Internship section."
        );
      }

      if (!resumeText.includes("skill")) {
        suggestions.push(
          "Add Skills section."
        );
      }

      res.json({
        success: true,
        atsScore,
        foundSkills,
        missingSkills,
        suggestions,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

module.exports = router;