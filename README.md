# Personal Assistant Using GenAI - Supervisor Agentic Pattern

A demonstration project showcasing the **Supervisor Agentic Pattern** using LangChain and LangGraph. This project implements an intelligent personal assistant that uses a supervisor agent to coordinate multiple specialized agents for calendar management, email handling, and contact management.

## Overview

The supervisor agentic pattern is an architectural approach where a central "supervisor" agent acts as a coordinator, routing user requests to specialized sub-agents based on the nature of the request. Each sub-agent is optimized for a specific domain:

- **Calendar Agent**: Handles scheduling, calendar events, and availability checks
- **Email Agent**: Manages email composition and sending notifications
- **Contact Agent**: Retrieves and manages contact information
- **Supervisor Agent**: Routes requests to appropriate agents and coordinates responses

## Architecture

```
User Input
    ↓
Supervisor Agent
    ├→ Schedule Event (Calendar Agent)
    ├→ Manage Email (Email Agent)
    └→ Manage Contacts (Contact Agent)
    ↓
User Response
```

## Project Structure

```

## Installation

### Prerequisites
- OpenAI API key

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_api_key_here
     ```

## Running the Project

### Start the Interactive Assistant

```bash
node --env-file=.env index.js 
```

The application will:
1. Run an initial demo query about scheduling a design team standup
2. Then enter an interactive mode where you can type commands
3. Type `bye`, `quit`, or `exit` to end the session

### Example Usage

```
Assistant: Hi, how can I help you?
You: Schedule a meeting with the design team tomorrow at 10am
Assistant: I'll schedule that meeting for you...
You: Send them an email reminder about the meeting
Assistant: Email sent to the design team...
You: Show me all contacts in the design team
Assistant: Here are the design team members...
You: exit
Assistant: Catch you later! If anything pops up, I've got you.
```

## Technologies Used

- **LangChain**: Framework for building applications with language models
- **LangGraph**: Building stateful, multi-agent applications
- **OpenAI**: GPT-4o language model for intelligent reasoning
- **Zod**: Schema validation for tool parameters
- **Node.js**: JavaScript runtime environment

## How It Works

1. **User sends a request** through the interactive CLI
2. **Supervisor Agent receives the request** and analyzes what actions are needed
3. **Supervisor routes to appropriate tools**:
   - `schedule_event` → Calendar Agent
   - `manage_email` → Email Agent
   - `manage_contacts` → Contact Agent
4. **Sub-agents execute** using their specialized tools
5. **Results are collected** and presented back to the user

## Tools Available

### Calendar Tools
- `create_calendar_event`: Create calendar events with attendees and time slots
- `get_available_time_slots`: Check availability for scheduling

### Email Tools
- `send_email`: Send emails with subject and body

### Contact Tools
- `get_contacts`: Retrieve contacts with filtering capabilities

## Development Notes

This is a **demonstration project** showing the supervisor agentic pattern. The tools use stub implementations:
- Calendar events are not saved to actual calendars
- Emails are not sent to real email addresses
- Contacts are hardcoded in the system

For production use, integrate real APIs:
- Google Calendar API or Outlook API for calendar management
- SendGrid, Gmail API, or similar for email
- Your own contact database or service