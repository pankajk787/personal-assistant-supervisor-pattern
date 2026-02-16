import readline from "readline/promises";
import { supervisorAgent } from "./agents/supervisorAgent.js";
import { Command } from "@langchain/langgraph";

async function main() {
  const config = { configurable: { thread_id: 1 } };
  let interrupts = [];
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("Assistant: Hi, how can I help you?");
  while (true) {
    const userInput = await rl.question("You: ");
    const lcUserInput = userInput.toLowerCase();

    if (
      lcUserInput === "bye" ||
      lcUserInput === "quit" ||
      lcUserInput === "exit"
    ) {
      console.log(
        "Assistant: Catch you later! If anything pops up, I’ve got you.",
      );
      break;
    }

    const query = userInput;

    const resume = {};

    if (interrupts.length) {
      const interrupt = interrupts[0];
      if(query === "2") {
        // Edit email flow
        const actionRequest = interrupt.value.actionRequests[0];
        if(actionRequest.name === "send_email") {
          const editedAction = { ...actionRequest };
          
          console.log("\nCurrent email details:");


          console.log(`To: ${editedAction.args.to}`);
          console.log(`Subject: ${editedAction.args.subject}`);
          console.log(`Body: ${editedAction.args.body}`);
          console.log("");
          
          const fieldToEdit = await rl.question("Which field to edit? (to/subject/body): ");
          const newValue = await rl.question(`Enter new ${fieldToEdit}: `);
          
          if (fieldToEdit === "to") {
            editedAction.args.to = newValue;
          } else if (fieldToEdit === "subject") {
            editedAction.args.subject = newValue;
          } else if (fieldToEdit === "body") {
            editedAction.args.body = newValue;
          }
          
          resume[interrupt.id] = { decisions: [{ type: "edit", editedAction }] };
        }
      }
      else {
        resume[interrupt.id] = {
          decisions: [
            { type: query === "1" ? "approve" : query === "3" ? "reject" : "" },
          ],
        };
      }
    }

    const result = await supervisorAgent.invoke(
      interrupts.length
        ? new Command({ resume })
        : {
            messages: [{ role: "user", content: query }],
          },
      config,
    );

    interrupts = []; // Clean the interrupts array

    let output = "";
    if (result.__interrupt__) {
      interrupts.push(result.__interrupt__[0]);
      output = `${result.__interrupt__[0].value.actionRequests[0].description}

Choose One option:

${result.__interrupt__[0].value.reviewConfigs[0].allowedDecisions.map((decision, idx) => `${idx + 1}. ${decision}`).join("\n")}
      `;
      console.log("Assistant: ", output);
    } else {
      console.log(
        "Assistant: ",
        result.messages[result.messages.length - 1].content,
      );
    }
  }

  rl.close();
}

main();
