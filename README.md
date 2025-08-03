# Is it Better?

Smart tech product comparison tool powered by AI.

## Overview

Is it Better? helps you decide whether upgrading your device is worthwhile. Enter your current device and the one you're considering, and the app compares performance, features, and value using Google's Gemini 2.5 Flash model. A lightweight Express backend tracks daily usage to stay within the free API quota.

## Getting started

### Prerequisites
- Node.js 20 (see `.nvmrc`)
- npm

### Setup

```sh
# Clone the repository
git clone <repository-url>
cd upgrade-wise-insight-66

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and set VITE_GEMINI_API_KEY=<your Gemini key>
# Optionally set VITE_BACKEND_URL (defaults to http://localhost:3001)
```

### Development

Run the front-end and quota server in separate terminals:

```sh
npm run dev       # Vite dev server
npm run server    # Express quota server on port 3001
```

Ensure `VITE_BACKEND_URL` in `.env` matches the port used by the server.

## Deployment

1. **Build the front end**

   ```sh
   npm run build
   ```

   Host the generated `dist/` directory on any static file server or CDN.

2. **Deploy the quota server**

   ```sh
   node server/server.js
   ```

   Set the `PORT` environment variable if you need a port other than `3001`, and update `VITE_BACKEND_URL` accordingly before building.

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Express

## Configuration

Create a `.env` file based on `.env.example` and provide your Gemini API key:

```bash
cp .env.example .env
# Edit .env and set VITE_GEMINI_API_KEY=<your Gemini key>
```

The application uses the free Gemini 2.5 Flash model with a daily limit of 500 requests. The code enforces a safety threshold of 490 requests per day to avoid hitting the quota. Responses are limited to 4096 tokens to encourage concise answers and reduce quota usage.

### Limiting response length
`VITE_GEMINI_MAX_OUTPUT_TOKENS` controls the maximum number of tokens Gemini will return. It's set to `4096` in `.env.example`, but you can lower this value in your `.env` file if the answers are too long.

### Clarifying specifications
If the automatic comparison doesn't provide enough specification data, the app prompts you to enter precise specs for the device that needs clarification. This ensures the analysis is as accurate as possible.

### Responsive specification dialog
The precise specs dialog adjusts to smaller screens and shows fields based on the device category (computer or vehicle). This keeps the form focused only on the information you need to provide.

### Immediate loading feedback
Clicking **Compare Now** instantly displays a spinner and small game so you know the comparison is running.

### Navigating away
Selecting the header while a result is on screen takes you back to the homepage, but first asks if you really want to leave.

