import { ChatOpenAi } from "@langchain/openai";

export const llm = new ChatOpenAi({
    model: "gpt-4.1"
});