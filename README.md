# Jiso - Your Personal Space for Healing and Growth

Jiso is a comprehensive mental health companion app designed to provide cognitive behavioral therapy (CBT) style support for users who lack access to traditional therapy solutions. This frontend repository contains the React TypeScript client for the Jiso platform.

## 🌟 About Jiso

Jiso was created for those moments when a therapist isn't available and friends feel distant. In a world where mental health support can be hard to access, Jiso offers a safe, judgment-free space where you can express your thoughts, track your emotional journey, and receive compassionate guidance.

Through thoughtful journaling, mood tracking, and AI-powered conversations with Ana (your AI therapist-like companion), Jiso helps you develop self-awareness and coping strategies. We analyze patterns in your entries to offer personalized insights, helping you understand yourself better and navigate life's challenges with greater resilience.

Jiso isn't a replacement for professional help, but it's a companion for the in-between moments—when you need to process your thoughts, find clarity, or simply be heard. Because everyone deserves support on their journey toward healing and growth.

## ✨ Features

### 📔 Daily Journaling

Express your thoughts freely in a private, secure space with structured or free-form journal entries. Jiso's journaling tool includes full Markdown support and emotion tagging.

### 🧠 Mood Logging

Track your emotional states over time to identify patterns and triggers. Visualize your mood journey with intuitive charts and gain insights into your emotional wellbeing.

### 💬 Ana, Your AI Companion

Chat with Ana, our compassionate AI assistant, whenever you need someone to talk to. Available 24/7, Ana listens without judgment and offers supportive conversations when you need them most.

### 📊 AI Insights

Receive personalized insights based on your journal entries and mood patterns. Discover connections between your thoughts, feelings, and behaviors with AI-powered analysis that helps guide your growth.

## 🧠 AI Integration

Jiso uses Qwen 2.5 7b as a local LLM with Ollama for AI integrations including:

- Personalized chat conversations with Ana
- Analysis of journal entries and mood patterns
- Generation of mental health insights
- Identification of cognitive patterns
- Supportive guidance using CBT principles

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **Data Visualization**: Chart libraries
- **Markdown Support**: ReactMarkdown
- **Rich Text Editing**: Tiptap
- **AI Integration**: Ollama with Qwen 2.5 7b

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Ollama (for local AI integration)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/jiso-frontend.git
   cd jiso-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following content:

   ```
   VITE_BACKEND_URL=http://localhost:8888/api/v1
   ```

   Adjust the URL to match your backend deployment if needed.

4. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 🖥️ Backend Setup

The backend for Jiso is available at: [https://github.com/kuldp18/jiso-backend](https://github.com/kuldp18/jiso-backend)

To set up the backend:

1. **Clone the backend repository:**

   ```bash
   git clone https://github.com/kuldp18/jiso-backend.git
   cd jiso-backend
   ```

2. **Follow the installation instructions** in the backend repository's README.md.

## 🤖 Setting Up Ollama for AI Integration

To use the AI features with Qwen 2.5 7b:

1. **Install Ollama** from [https://ollama.com/](https://ollama.com/) for your platform.

2. **Pull or Run the Qwen 2.5 7b model:**

   ```bash
   ollama run qwen2.5
   ```

3. **Run Ollama:**

   ```bash
   ollama serve
   ```

4. **Ensure your backend is configured** to communicate with Ollama.

## 🏗️ Project Structure

- `/src`: Source code
  - `/api`: API client and service functions
  - `/assets`: Static assets and images
  - `/components`: React components
    - `/app`: Application-specific components
    - `/dashboard`: Dashboard widgets and cards
    - `/ui`: ShadCN UI components
    - `/toolbars`: Editor toolbars
  - `/lib`: Utility functions and helpers
  - `/pages`: Page components
  - `/stores`: Zustand state stores
  - `/types`: TypeScript type definitions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
