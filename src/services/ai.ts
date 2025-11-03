import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAIInsight = async (messages: string[]) => {
  const text = messages.join(" ");

  const prompt = `
Analyze the following chat messages and return a JSON object with:
{
  "summary": "short summary of the conversation",
  "sentiment": "positive | negative | neutral"
}

Messages:
${text}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that analyzes user messages and provides sentiment and summary.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" }, 
  });

  const result = completion.choices[0].message?.content;

  if (!result) return { summary: "", sentiment: "neutral" };

  try {
    return JSON.parse(result);
  } catch {
    return { summary: result.slice(0, 100), sentiment: "neutral" };
  }
};
