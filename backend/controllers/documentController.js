import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

// @desc    Upload PDF document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res, next) => {
  try {
    // 1. Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a PDF file",
        statusCode: 400,
      });
    }

    const { title } = req.body;

    // 2. Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please provide a document title",
        statusCode: 400,
      });
    }

    // 3. Upload PDF to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    // 4. Create document in MongoDB
    const document = await Document.create({
      userId: req.user._id,

      title: title.trim(),

      fileName: req.file.originalname,

      // Cloudinary URL
      filePath: cloudinaryResult.secure_url,

      // Needed later when deleting the PDF
      cloudinaryPublicId: cloudinaryResult.public_id,

      fileSize: req.file.size,

      status: "processing",
    });

    // 5. Process PDF in background
    processPDF(
      document._id,
      req.file.buffer
    ).catch((err) => {
      console.error("PDF processing error:", err);
    });

    // 6. Send response
    res.status(201).json({
      success: true,
      data: document,
      message:
        "Document uploaded successfully. Processing in progress...",
    });
  } catch (error) {
    console.error("Upload document error:", error);
    next(error);
  }
};


// ==========================================
// PROCESS PDF
// ==========================================

const processPDF = async (documentId, fileBuffer) => {
  try {
    // Extract text from PDF buffer
    const { text } = await extractTextFromPDF(fileBuffer);

    // Create chunks
    const chunks = chunkText(text, 500, 50);

    // Update document
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: "ready",
    });

    console.log(
      `Document ${documentId} processed successfully`
    );
  } catch (error) {
    console.error(
      `Error processing document ${documentId}:`,
      error
    );

    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
    });
  }
};


// ==========================================
// GET ALL USER DOCUMENTS
// ==========================================

// @desc    Get all user documents
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
        },
      },

      // Get flashcards
      {
        $lookup: {
          from: "flashcards",
          localField: "_id",
          foreignField: "documentId",
          as: "flashcardSets",
        },
      },

      // Get quizzes
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "documentId",
          as: "quizzes",
        },
      },

      // Count flashcards and quizzes
      {
        $addFields: {
          flashcardCount: {
            $size: "$flashcardSets",
          },

          quizCount: {
            $size: "$quizzes",
          },
        },
      },

      // Don't send large extracted data
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0,
        },
      },

      // Latest documents first
      {
        $sort: {
          uploadDate: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error("Get documents error:", error);
    next(error);
  }
};


// ==========================================
// GET SINGLE DOCUMENT
// ==========================================

// @desc    Get single document with chunks
// @route   GET /api/documents/:id
// @access  Private
export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404,
      });
    }

    // Get flashcard count
    const flashcardCount =
      await Flashcard.countDocuments({
        documentId: document._id,
        userId: req.user._id,
      });

    // Get quiz count
    const quizCount =
      await Quiz.countDocuments({
        documentId: document._id,
        userId: req.user._id,
      });

    // Update last accessed
    document.lastAccessed = new Date();

    await document.save();

    // Convert mongoose document to object
    const documentData = document.toObject();

    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;

    res.status(200).json({
      success: true,
      data: documentData,
    });
  } catch (error) {
    console.error("Get document error:", error);
    next(error);
  }
};


// ==========================================
// DELETE DOCUMENT
// ==========================================

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404,
      });
    }

    // Delete PDF from Cloudinary
    if (document.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(
        document.cloudinaryPublicId,
        {
          resource_type: "raw",
        }
      );
    }

    // Delete document from MongoDB
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    next(error);
  }
};


// ==========================================
// UPDATE DOCUMENT
// ==========================================

// @desc    Update document title
// @route   PUT /api/documents/:id
// @access  Private
export const updateDocument = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please provide a document title",
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404,
      });
    }

    document.title = title.trim();

    await document.save();

    res.status(200).json({
      success: true,
      data: document,
      message: "Document updated successfully",
    });
  } catch (error) {
    console.error("Update document error:", error);
    next(error);
  }
};