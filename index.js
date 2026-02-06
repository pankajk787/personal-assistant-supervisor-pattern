import readline from "readline/promises";
import { supervisorAgent } from "./agents/supervisorAgent";

const query = "Schedule a design team standup for tomorrow at 9am. Send every individual in design team a notification about this";

const stream = await supervisorAgent.stream({
  messages: [{ role: "user", content: query }]
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

async function main() {
  const config = { configurable: { thread_id: 1 } };
  const rl =readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log("Assistant: Hi, how can I help you?");
  while(true) {
    const userInput = await rl.question("You: ");
    const lcUserInput = userInput.toLowerCase();
    if(lcUserInput === "bye" || lcUserInput === "quit" || lcUserInput === "exit") {
        console.log("Assistant: Catch you later! If anything pops up, I’ve got you.");
        break;
    }

    const query = userInput;

    const stream = await supervisorAgent.stream({
      messages: [{ role: "user", content: query }]
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


  rl.close();
}

main()