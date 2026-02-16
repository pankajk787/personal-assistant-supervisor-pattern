import { tool } from "langchain";
import { z } from "zod";
import { calendarAgent } from "./agents/calendarAgent.js";
import { emailAgent } from "./agents/emailAgent.js";
import { contactAgent } from "./agents/contactAgent.js";

// Tools for supervisor agent using which it will communicate with the calendarAgent, contactAgent and emailAgent

export const scheduleEvent = tool(
  async ({ request }) => {
    const result = await calendarAgent.invoke({
      messages: [{ role: "user", content: request }],
    });
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.text;
  },
  {
    name: "schedule_event",
    description: `
Schedule calendar events using natural language.

Use this when the user wants to create, modify, or check calendar appointments.
Handles date/time parsing, availability checking, and event creation.

Input: Natural language scheduling request (e.g., 'meeting with design team next Tuesday at 2pm')
    `.trim(),
    schema: z.object({
      request: z.string().describe("Natural language scheduling request"),
    }),
  },
);

export const manageEmail = tool(
  async ({ request }) => {
    const result = await emailAgent.invoke({
      messages: [{ role: "user", content: request }],
    });
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.text;
  },
  {
    name: "manage_email",
    description: `
Send emails using natural language.

Use this when the user wants to send notifications, reminders, or any email communication.
Handles recipient extraction, subject generation, and email composition.

Input: Natural language email request (e.g., 'send them a reminder about the meeting')
    `.trim(),
    schema: z.object({
      request: z.string().describe("Natural language email request"),
    }),
  },
);

export const manageContacts = tool(
  async ({ request }) => {
    const result = await contactAgent.invoke({
      messages: [{ role: "user", content: request }],
    });
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.text;
  },
  {
    name: "manage_contacts",
    description: `
Get contacts using natural language.

Use this when user wants to get list of contacts or even single contact.

Input: Natural language contact request (e.g., 'give me all contacts of design team members')
    `.trim(),
    schema: z.object({
      request: z.string().describe("Natural language contact list request"),
    }),
  },
);
