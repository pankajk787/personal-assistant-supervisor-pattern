import { createAgent } from "langchain";
import { llm } from "../model";
import { manageContacts, manageEmail, scheduleEvent } from "../tools";
import { MemorySaver } from "@langchain/langgraph";

const SUPERVISOR_PROMPT = `
You are a helpful personal assistant.
You can schedule calendar events, get contact list and send emails.
To send emails/notificationsfirst call the manage_contacts tool get the email addresses.
Break down user requests into appropriate tool calls and coordinate the results.
When a request involves multiple actions, use multiple tools in sequence.
`.trim();

export const supervisorAgent = createAgent({
  model: llm,
  tools: [scheduleEvent, manageEmail, manageContacts],
  systemPrompt: SUPERVISOR_PROMPT,
  checkpointer: new MemorySaver()
});
