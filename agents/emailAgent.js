import { createAgent, humanInTheLoopMiddleware, tool } from "langchain";
import { z } from "zod";
import { llm } from "../model.js";

export const sendEmail = tool(
  async ({ to, subject, body, cc }) => {
    // Stub: In practice, this would call SendGrid, Gmail API, etc.
    return `Email sent to ${to.join(", ")} - Subject: ${subject}`;
  },
  {
    name: "send_email",
    description:
      "Send an email via email API. Requires properly formatted addresses.",
    schema: z.object({
      to: z.array(z.string()).describe("email addresses"),
      subject: z.string(),
      body: z.string(),
      cc: z.array(z.string()).optional(),
    }),
  },
);

const EMAIL_AGENT_PROMPT = `
You are an email assistant.
Compose professional emails based on natural language requests.
Extract recipient information and craft appropriate subject lines and body text.
Use send_email to send the message.
Always confirm what was sent in your final response.
`.trim();

export const emailAgent = createAgent({
  model: llm,
  tools: [sendEmail],
  systemPrompt: EMAIL_AGENT_PROMPT,
  middleware: [ 
    humanInTheLoopMiddleware({ 
      interruptOn: { send_email: true }, 
      descriptionPrefix: "Outbound email pending approval", 
    }), 
  ],
});

// test the agent
async function main() {
  const query =
    "Send the design team a reminder about reviewing the new mockups";

  const stream = await emailAgent.stream({
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

// main()