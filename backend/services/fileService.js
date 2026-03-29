const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Extract text from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

// Extract text from DOC/DOCX (simplified - you might want to use a library like mammoth)
const extractTextFromDOC = async (filePath) => {
  // For simplicity, return empty string
  // In production, use libraries like mammoth for DOCX
  console.log('DOC extraction not implemented fully');
  return '';
};

// Main function to extract text from any supported file
const extractTextFromFile = async (filePath, mimetype) => {
  if (mimetype === 'application/pdf') {
    return await extractTextFromPDF(filePath);
  } else if (mimetype.includes('word')) {
    return await extractTextFromDOC(filePath);
  }
  throw new Error('Unsupported file type');
};

module.exports = {
  upload,
  extractTextFromFile,
};