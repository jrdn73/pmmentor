# Career Roadmap Generator 🚀

A powerful AI-powered web application that generates personalized career roadmaps based on your goals, background, and areas for improvement. Built with Next.js, Tailwind CSS, and OpenAI.

## Features ✨

- **Personalized Roadmaps**: Generate detailed career roadmaps with milestones, tasks, and resources
- **AI-Powered**: Uses GPT-4o for intelligent roadmap generation and chatbot assistance
- **Resource Library**: 25+ curated career development resources with vector search
- **Interactive Chatbot**: Ask follow-up questions about your roadmap
- **PDF Export**: Export your roadmap as a beautifully formatted PDF
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Jordan's Style**: Energetic, authentic, and hype-filled experience! 🎯

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4o, OpenAI Embeddings
- **Vector Search**: FAISS (faiss-node)
- **PDF Generation**: pdf-lib
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom gradients and animations

## Getting Started 🚀

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-roadmap-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage 📖

1. **Enter Your Career Goal**: Fill out the form with your career aspirations
2. **Add Context** (optional): Include your background, timeline, and areas to improve
3. **Generate Roadmap**: Click "Generate My Roadmap" to create your personalized plan
4. **Explore Milestones**: Click on each milestone to see detailed tasks and resources
5. **Chat with AI**: Use the chatbot to ask questions about your roadmap
6. **Export PDF**: Download your roadmap as a PDF for offline reference

## API Endpoints 🔌

### POST `/api/generate-roadmap`
Generates a personalized career roadmap.

**Request Body:**
```json
{
  "goal": "Become a Senior Software Engineer",
  "background": "2 years experience with React",
  "timeline": "18 months",
  "weaknesses": ["system design", "algorithms"]
}
```

**Response:**
```json
{
  "id": "roadmap_1234567890",
  "goal": "Become a Senior Software Engineer",
  "milestones": [...],
  "generated_at": "2024-01-01T00:00:00.000Z"
}
```

### POST `/api/chat`
Chat with the AI assistant about your roadmap.

**Request Body:**
```json
{
  "message": "How should I approach the first milestone?",
  "roadmapId": "roadmap_1234567890"
}
```

**Response:**
```json
{
  "response": "Great question! For your first milestone..."
}
```

## Project Structure 📁

```
src/
├── app/
│   ├── api/
│   │   ├── generate-roadmap/
│   │   └── chat/
│   └── page.tsx
├── components/
│   ├── CareerGoalForm.tsx
│   ├── RoadmapDisplay.tsx
│   └── ChatbotWidget.tsx
├── utils/
│   ├── vectorSearch.ts
│   ├── prompts.ts
│   ├── storage.ts
│   └── pdfGenerator.ts
└── resources.json
```

## Customization 🎨

### Adding New Resources
Edit `resources.json` to add new career development resources. Each resource should include:
- `id`: Unique identifier
- `title`: Resource name
- `type`: Type (book, course, documentation, etc.)
- `category`: Category for filtering
- `description`: Detailed description
- `url`: Resource URL
- `tags`: Array of relevant tags

### Modifying Prompts
Edit `src/utils/prompts.ts` to customize the AI's personality and response style.

### Styling
The app uses Tailwind CSS with custom gradients and animations. Modify the classes in components to change the appearance.

## Deployment 🚀

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- OpenAI for the amazing GPT-4o API
- Vercel for the excellent Next.js framework
- The open-source community for all the amazing tools and libraries

## Support 💬

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

Built with ❤️ by the Career Roadmap Generator team. Let's build amazing careers together! 🚀