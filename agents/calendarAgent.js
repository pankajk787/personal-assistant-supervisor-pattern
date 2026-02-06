import { createAgent } from "langchain";
import { createCalendarEvent, getAvailableTimeSlots } from "./tools";
import { llm } from "../model";

const CALENDAR_AGENT_PROMPT = `
You are a calendar scheduling assistant.
Parse natural language scheduling requests (e.g., 'next Tuesday at 2pm')
into proper ISO datetime formats.
Use get_available_time_slots to check availability when needed.
Use create_calendar_event to schedule events.
Always confirm what was scheduled in your final response.
`.trim();

export const calendarAgent = createAgent({
  model: llm,
  tools: [createCalendarEvent, getAvailableTimeSlots],
  systemPrompt: CALENDAR_AGENT_PROMPT,
});

// test calendar agent

async function main() {
  const query = "Schedule a team meeting next Tuesday at 2pm for 1 hour";

  const stream = await calendarAgent.stream({
    messages: [{ role: "user", content: query }],
  });

  for await (const step of stream) {
    for (const update of Object.values(step)) {
      if (update && typeof update === "object" && "messages" in update) {
        for (const message of update.messages) {
          console.log(message.toFormattedString());
        }
      }
    }
  }
}

// main();
