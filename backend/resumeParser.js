const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractResumeText(fileBuffer, mimeType) {
  if (mimeType === "application/pdf") {
    const data = await pdfParse(fileBuffer);

    return data.text.trim();
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: fileBuffer
    });

    return result.value.trim();
  }

  throw new Error(
    "Unsupported resume file type. Please upload PDF or DOCX."
  );
}

module.exports = {
  extractResumeText
};