# 🎨 ColourCloud

Generate beautiful gradient color palettes instantly using AI. Pick a color, get inspired.

## ✨ Features

- **AI-Powered Generation** - Uses Google Gemini to create unique gradient palettes
- **Fast & Responsive** - Optimized with skeleton loaders and lite AI model
- **Copy CSS Code** - Export gradients directly to your projects
- **Custom Generation** - Specify mood, theme, and style preferences
- **Beautiful UI** - Modern, intuitive interface with smooth animations

## 🚀 Tech Stack

- React 19 + TypeScript
- Vite
- Google Gemini AI API
- Tailwind CSS
- Netlify

## 🛠️ Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Tharul-J/ColourCloud.git
   cd ColourCloud
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

4. Run locally:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 🌐 Deploy to Netlify

1. Push to GitHub
2. Import project on [Netlify](https://netlify.com)
3. Add environment variable: `VITE_GEMINI_API_KEY`
4. Deploy!

Build settings are auto-configured via `netlify.toml`.

## 👨‍💻 Author

**Tharul Jayasundara**
- GitHub: [@Tharul-J](https://github.com/Tharul-J)

## 📝 License

MIT
