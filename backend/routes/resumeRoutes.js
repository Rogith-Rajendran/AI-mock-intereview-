const express = require("express");
const multer = require("multer");

const Resume = require("../models/Resume");

const {
  extractResumeText
} = require("../resumeParser");

const router = express.Router();


// ========================================
// MULTER CONFIGURATION
// ========================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF and DOCX files are allowed."
        )
      );
    }
  }
});


// ========================================
// UPLOAD RESUME
// ========================================

router.post(
  "/upload",
  upload.single("resume"),

  async (req, res) => {
    try {

      const { userId } = req.body;


      // Check user ID
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required."
        });
      }


      // Check resume
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a resume."
        });
      }


      // ====================================
      // EXTRACT RESUME TEXT
      // ====================================

      const extractedText =
        await extractResumeText(
          req.file.buffer,
          req.file.mimetype
        );


      if (!extractedText) {
        return res.status(400).json({
          success: false,
          message:
            "Could not extract text from the resume."
        });
      }


      // ====================================
      // SAVE RESUME FOR THIS USER
      // ====================================

      const resume =
        await Resume.findOneAndUpdate(

          {
            userId: userId
          },

          {
            userId: userId,

            fileName:
              req.file.originalname,

            fileType:
              req.file.mimetype,

            fileData:
              req.file.buffer,

            extractedText:
              extractedText
          },

          {
            new: true,
            upsert: true
          }
        );


      // ====================================
      // SUCCESS
      // ====================================

      return res.status(200).json({

        success: true,

        message:
          "Resume uploaded successfully.",

        resume: {
          id: resume._id,
          fileName: resume.fileName,
          fileType: resume.fileType
        }

      });

    } catch (error) {

      console.error(
        "Resume upload error:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to upload resume."

      });
    }
  }
);


// ========================================
// GET USER RESUME
// ========================================

router.get(
  "/:userId",

  async (req, res) => {
    try {

      const resume =
        await Resume.findOne({
          userId: req.params.userId
        }).select("-fileData");


      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found."
        });
      }


      return res.status(200).json({

        success: true,

        resume: {
          id: resume._id,
          userId: resume.userId,
          fileName: resume.fileName,
          fileType: resume.fileType,
          extractedText:
            resume.extractedText,
          createdAt:
            resume.createdAt,
          updatedAt:
            resume.updatedAt
        }

      });

    } catch (error) {

      console.error(
        "Get resume error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to get resume."
      });
    }
  }
);


module.exports = router;