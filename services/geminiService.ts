import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

export const getQuestionExplanation = async (question: Question): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const prompt = `
    你是一位世界级的高级前端工程师正在进行一场技术面试。
    
    请用简体中文针对以下面试题提供全面的解答：
    "${question.title}"
    
    背景/细节: ${question.shortDescription}
    难度等级: ${question.difficulty}
    主题: ${question.category}

    请使用 Markdown 格式组织你的回答：
    1. 首先给出一个直接的、高层次的总结（"TL;DR" 或 "一句话总结"）。
    2. 提供该概念的详细原理解析。
    3. 重要：必须包含代码示例，使用标准的 Markdown 代码块 (例如 \`\`\`javascript ... \`\`\`) 来演示该概念。
    4. 提及与该主题相关的常见陷阱或注意事项。
    5. 如果适用，请提及性能影响或优化建议。

    保持语气专业、鼓励性强且技术精准。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "你是一位帮助候选人准备面试的专家级技术面试官。",
        temperature: 0.7,
      }
    });

    return response.text || "未能生成解析。";
  } catch (error) {
    console.error("Error fetching explanation from Gemini:", error);
    throw new Error("生成解析失败，请重试。");
  }
};