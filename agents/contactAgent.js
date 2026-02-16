import { createAgent, tool } from "langchain";
import { z } from "zod";
import { llm } from "../model.js";

export const getContacts = tool(
  async ({ search }) => {
    return JSON.stringify([
      {
        id: 1,
        team: "design",
        name: "Pankaj",
        email: "pankajadi447@gmail.com",
      },
      {
        id: 2,
        team: "design",
        name: "Shreyansh",
        email: "shreyansh@gmail.com",
      },
      { id: 3, team: "development", name: "Kevin", email: "kevin47@gmail.com" },
    ]);
  },
  {
    name: "get_contacts",
    description: "Get contact list.",
    schema: z
      .string()
      .describe("search query for the contact. e.g: design or kevin"),
  },
);

const CONTACT_AGENT_PROMPT = `
You are a contact assistant.
Find or create contact records as per requirement.
Use get_contacts to get the contact list
`.trim();

export const contactAgent = createAgent({
  model: llm,
  tools: [getContacts],
  systemPrompt: CONTACT_AGENT_PROMPT,
});