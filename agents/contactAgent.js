import { createAgent } from "langchain";
import { getContacts } from "../tools";
import { llm } from "../model";

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