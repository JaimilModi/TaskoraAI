import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

// NVIDIA DeepSeek AI Setup
const AI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

// ------------------- ARTICLE GENERATOR -------------------
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const improvedPrompt = `
Write a well-structured article on the topic below.

Topic: ${prompt}

The article must include:
- Introduction
- Main sections with headings
- Conclusion

Write approximately ${length} words.
`;

    const response = await AI.chat.completions.create({
      model: "deepseek-ai/deepseek-v3.1",
      messages: [
        { role: "system", content: "You are a professional article writer." },
        { role: "user", content: improvedPrompt },
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 800,
      extra_body: {
        chat_template_kwargs: { thinking: true },
      },
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- BLOG TITLE GENERATOR -------------------
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "deepseek-ai/deepseek-v3.1",
      messages: [
        { role: "system", content: "Generate catchy blog titles." },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      top_p: 0.9,
      max_tokens: 60,
      extra_body: {
        chat_template_kwargs: { thinking: true },
      },
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- IMAGE GENERATOR -------------------
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This Feature is only available for premium subscriptions",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLICKDROP_API_KEY },
        responseType: "arraybuffer",
      },
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary",
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- REMOVE IMAGE BACKGROUND -------------------
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This Feature is only available for premium subscriptions",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove Background from image', ${secure_url}, 'image')
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- REMOVE IMAGE OBJECT -------------------
export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This Feature is only available for premium subscriptions",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- PDF REVIEW -------------------
export const reviewPdf = async (req, res) => {
  try {
    const { userId } = req.auth();
    const PDF = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This Feature is only available for premium subscriptions",
      });
    }

    if (PDF.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "PDF file size exceeds allowed size (5MB).",
      });
    }

    const dataBuffer = fs.readFileSync(PDF.path);
    const pdfData = await pdf(dataBuffer);

    let text = pdfData.text;

    // Limit text size to avoid token overflow
    if (text.length > 12000) {
      text = text.substring(0, 12000);
    }

    const prompt = `
You are a professional document reviewer.

Review the following PDF content and provide:
- Content feedback
- Structure feedback
- Clarity feedback
- Tone feedback
- Suggestions for improvement
IMPORTANT:
Write between 500 and 600 words only.
Do not exceed 600 words.
Do not write less than 500 words.
PDF Content:
${text}
`;

    const response = await AI.chat.completions.create({
      model: "deepseek-ai/deepseek-v3.1",
      messages: [
        {
          role: "system",
          content: "You are a professional document reviewer.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      top_p: 0.8,
      max_tokens: 900,
      extra_body: {
        chat_template_kwargs: { thinking: true },
      },
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Review the pdf', ${content}, 'review-pdf')
    `;

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
