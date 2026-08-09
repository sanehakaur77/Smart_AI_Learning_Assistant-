import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async (buffer) => {
  let parser;

  try {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error("PDF input must be a Buffer");
    }

    console.log("PDF buffer received:", buffer.length, "bytes");

    parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    return {
      text: result.text || "",
      numPages: result.total || 0,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);

    throw new Error("Failed to extract text from PDF");
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};