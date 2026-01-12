import axios from "axios";

// ChatGPT API integration
async function generateBooksAndPdfs(topic) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides learning recommendations. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: `Generate 5 recommended books and 5 interview-focused PDFs for learning ${topic}. 
            Return JSON in this exact format:
            {
              "books": [
                {"title": "Book Title", "author": "Author Name", "description": "Brief description"}
              ],
              "interviewPdfs": [
                {"title": "Interview Questions Title", "description": "Brief description"}
              ]
            }`
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating books with ChatGPT:", error);
    // Fallback data
    return {
      books: [
        { title: `${topic} Fundamentals`, author: "Expert Author", description: "Comprehensive guide to ${topic}" },
        { title: `Mastering ${topic}`, author: "Pro Developer", description: "Advanced concepts and best practices" },
      ],
      interviewPdfs: [
        { title: `${topic} Interview Questions`, description: "Top 30 interview questions with answers" },
        { title: `${topic} Technical Assessment`, description: "Practical problems and solutions" },
      ],
    };
  }
}

// Google Books API integration
async function searchGoogleBooks(title, author) {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    );

    const books = response.data.items || [];
    return books.map(book => {
      const volumeInfo = book.volumeInfo;
      return {
        title: volumeInfo.title || title,
        author: volumeInfo.authors?.join(", ") || author,
        description: volumeInfo.description || "",
        thumbnail: volumeInfo.imageLinks?.thumbnail || "",
        previewUrl: volumeInfo.previewLink || "",
        isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || "",
        publishedDate: volumeInfo.publishedDate || "",
        pdfUrl: volumeInfo.accessInfo?.pdf?.isAvailable === true ? 
          volumeInfo.accessInfo.pdf?.acsTokenLink : "",
      };
    });
  } catch (error) {
    console.error("Error searching Google Books:", error);
    return [];
  }
}

export async function getBooks(req, res) {
  try {
    const { topic } = req.query;
    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    // Generate recommendations using ChatGPT
    const generated = await generateBooksAndPdfs(topic);
    
    // Search Google Books for real data
    const booksWithDetails = [];
    for (const book of generated.books) {
      const googleBooks = await searchGoogleBooks(book.title, book.author);
      if (googleBooks.length > 0) {
        // Use the first result with generated description
        booksWithDetails.push({
          ...googleBooks[0],
          description: book.description,
        });
      } else {
        // Fallback to generated data
        booksWithDetails.push({
          ...book,
          thumbnail: "",
          previewUrl: "",
          isbn: "",
          publishedDate: "",
          pdfUrl: "",
        });
      }
    }

    res.json({
      books: booksWithDetails,
      interviewPdfs: generated.interviewPdfs,
    });
  } catch (error) {
    console.error("Error in getBooks:", error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
}

export async function generateInterviewPdf(req, res) {
  try {
    const { topic, planId } = req.body;
    if (!topic || !planId) {
      return res.status(400).json({ message: "Topic and planId are required" });
    }

    // Generate interview questions using ChatGPT
    const chatGptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert technical interviewer. Generate comprehensive interview questions and answers."
          },
          {
            role: "user",
            content: `Generate 30 interview questions and detailed answers for ${topic}. 
            Include:
            - Basic concepts (10 questions)
            - Intermediate topics (10 questions) 
            - Advanced concepts (10 questions)
            
            Format each question and answer clearly. Make it suitable for a PDF document.`
          }
        ],
        max_tokens: 2500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = chatGptResponse.data.choices[0].message.content;
    
    // Generate PDF using PDFKit
    const PDFDocument = require('pdfkit');
    const fs = require('fs');
    const path = require('path');
    
    const doc = new PDFDocument();
    const filename = `${topic.replace(/\s+/g, '_')}_Interview_Questions_${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), 'uploads', 'interviews', filename);
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Pipe PDF to file
    doc.pipe(fs.createWriteStream(filePath));
    
    // Add content to PDF
    doc.fontSize(20).text(`${topic} Interview Questions`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);
    
    // Add the generated content
    const lines = content.split('\n');
    let isQuestion = true;
    
    lines.forEach(line => {
      if (line.trim()) {
        if (line.match(/^\d+\./) || line.match(/^Q\d/)) {
          isQuestion = true;
          doc.fontSize(14).font('Helvetica-Bold').text(line.trim());
        } else if (line.match(/^Answer:/i) || line.match(/^A\d/)) {
          isQuestion = false;
          doc.fontSize(12).font('Helvetica-Bold').text(line.trim());
        } else {
          doc.fontSize(11).font('Helvetica').text(line.trim(), { indent: isQuestion ? 0 : 20 });
        }
        doc.moveDown(0.5);
      }
    });
    
    doc.end();
    
    // Wait for PDF to be created
    await new Promise((resolve, reject) => {
      doc.on('end', resolve);
      doc.on('error', reject);
    });
    
    // Update plan with interview PDF
    const Plan = require('../models/Plan');
    await Plan.findByIdAndUpdate(planId, {
      $push: {
        'resourcesByType.interviewPdfs': {
          title: `${topic} Interview Questions`,
          filename,
          downloadUrl: `/api/files/interviews/${filename}`,
        }
      }
    });
    
    res.json({
      success: true,
      filename,
      downloadUrl: `/api/files/interviews/${filename}`,
    });
    
  } catch (error) {
    console.error("Error generating interview PDF:", error);
    res.status(500).json({ message: "Failed to generate interview PDF" });
  }
}
