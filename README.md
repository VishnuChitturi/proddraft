# ProdDraft

**Live demo:** [Open the app in your browser](https://proddraft.netlify.app/)

**Local development URL:** `http://localhost:3000`

ProdDraft is a lightweight React + Vite app that transforms a simple product idea into a structured, professional Product Requirements Document (PRD) using a GenAI model.

The app is designed to help founders, product managers, and developers quickly generate clear product documentation — including problem statements, objectives, user personas, features, and more — with minimal input.

---

## Features

- Generate complete PRDs from a single product idea input.
- Structured outputs including:
  - Problem Statement
  - Objectives
  - User Personas
  - Core Features
  - Future Scope
- Clean, readable layout for product documentation.
- Export PRD as PDF with formatted sections and alignment.
- Fast generation using AI with structured responses.
- Simple UI focused on productivity and clarity.

---

## Tech stack

- React (functional components)
- Vite (dev server and build)
- TypeScript
- TailwindCSS (styling)
- GenAI client (e.g., provider SDK)
- motion (animation primitives)

---

## Quick start

### Prerequisites

- Node.js (recommended v18+)
- npm or yarn

---

### Install dependencies

```bash
npm install
# or
# yarn install
```

### Configure environment

Create a file named `.env` or `.env.local` in the project root with your model API key. Example:

```env
VITE_GEMINI_API_KEY=your_api_key_here
# or (if your setup uses a non-prefixed env var)
GEMINI_API_KEY=your_api_key_here
```

Notes:
- The client reads the key via `import.meta.env.VITE_GEMINI_API_KEY` in the browser build.
- Some server-side or build-time code may reference `process.env.GEMINI_API_KEY` depending on the project setup. Keep both if unsure.
- Ensure the key has access to the model you intend to use.

### Run the dev server

```bash
npm run dev
```

By default this project is configured to use `http://localhost:3000` for development. If the port is different, the terminal output will show the exact local URL.

To expose the dev server on your LAN for testing on other devices:

```bash
npm run dev -- --host
```

### Build and preview

```bash
npm run build
npm run preview
```

Useful scripts (if present in `package.json`):

- `npm run clean` — remove build output
- `npm run lint` — type-check / lint

---

## Project structure (high level)

- `src/App.tsx` — main UI and PRD layout
- `src/main.tsx` — app bootstrap
- `src/services/gemini.ts` — AI generation logic
- `src/utils/pdf.ts` — PDF export logic
- `index.html`, `vite.config.ts`, `tsconfig.json` — build & config
- `package.json` — scripts and dependencies

---

## Model integration details

The core generation logic lives in `src/services/gemini.ts`.
- The function (e.g., `generatePRD`) sends structured prompts to the model and expects a well-formatted JSON response.
- The response is parsed and rendered into different PRD sections.

If the model returns invalid or incomplete JSON:
- The app may throw an error — check console logs for details.
- Add validation and fallback handling in `gemini.ts` to make parsing more robust.

### Tips
- Modify prompts in `src/services/gemini.ts` to improve PRD quality.
- You can extend the response schema to include:
  - KPIs
  - User flows
  - Technical architecture

---

## Usage

1. Open the app in your browser (`http://localhost:3000`).
2. Enter your product idea.
3. Click "Generate PRD".
4. Review the structured PRD sections.
5. Export as PDF if needed.

---

## Troubleshooting

- Generation errors:
  - Ensure `VITE_GEMINI_API_KEY` (or `GEMINI_API_KEY`) is valid and has model access.
  - Check console/network logs for API errors.
- PDF issues:
  - Ensure content is fully rendered before export.
  - Verify PDF library configuration.
- Dev server issues:
  - Reinstall dependencies:

```bash
rm -rf node_modules && npm install
```

---

## Contributing

Contributions are welcome.
Suggested workflow:
1. Fork the repository
2. Create a feature branch
3. Add improvements (UI, features, AI logic)
4. Submit a PR with a clear description

---

## License

This repository includes an MIT `LICENSE` file. Update or change the license if you plan to publish under a different license.

---

## Acknowledgements

Built by Vishnu.

Designed for fast product thinking, rapid ideation, and AI-powered documentation workflows.
Inspired by modern product tools and startup builders.
