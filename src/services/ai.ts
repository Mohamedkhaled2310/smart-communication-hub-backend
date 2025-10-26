export const generateAIInsight = async (messages: string[]) => {
    const text = messages.join(" ");
    const sentiment =
      text.includes("happy") || text.includes("great")
        ? "positive"
        : text.includes("bad") || text.includes("sad")
        ? "negative"
        : "neutral";
  
    const summary = text.length > 50 ? text.slice(0, 50) + "..." : text;
  
    return { summary, sentiment };
  };
  