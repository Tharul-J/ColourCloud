# ColourCloud

A simple website that generates beautiful gradient colour palettes based on your selected colour, powered by Google's Gemini AI.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Features

- Generate AI-powered gradient palettes from any base color
- Interactive chat with AI for custom gradient requests
- Export gradients as CSS code
- Responsive design with modern UI

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deploy to Netlify

1. Push this repository to GitHub
2. Connect to Netlify
3. Add `GEMINI_API_KEY` environment variable in Netlify settings
4. Deploy!

View the original app in AI Studio: https://ai.studio/apps/drive/1pynaK1HBbDD0MsnBU3aa0Ya375Ct4FFn
