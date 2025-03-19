# 🍿 Popcorn Times

![Popcorn Times Banner](https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80)

> Discover your next favorite movie

## 🔗 Live Demo

[https://popcorn-times-five.vercel.app/](https://popcorn-times-five.vercel.app/)

## 📝 Description

Popcorn Times is a movie discovery platform that allows users to search for movies, view detailed information, and save their favorites. Built with React and Redux, it provides a seamless user experience for movie enthusiasts.

## ✨ Features

- **Movie Search** - Search for movies by title with instant results
- **Movie Details** - View comprehensive information about any movie
- **Genre Browsing** - Browse movies by genre (Action, Drama, Sci-Fi)
- **Favorites Collection** - Save and manage your favorite movies
- **Responsive Design** - Optimized for both desktop and mobile devices
- **Loading States** - Smooth loading transitions with animated indicators

## 🛠️ Built With

- **React** - UI components and rendering
- **Redux** - State management
- **TypeScript** - Type safety and development experience
- **Tailwind CSS** - Styling and responsive design
- **Vite** - Fast development and optimized builds
- **OMDb API** - Movie data source
- **Lottie** - Animation for the logo and loading states

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/popcorn-times.git
cd popcorn-times
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Add your OMDb API key (Get one at [omdbapi.com](https://www.omdbapi.com/apikey.aspx))

```bash
VITE_OMDB_API_KEY=your_api_key_here
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## 📊 Project Structure

```
popcorn-times/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── constants/       # Application constants
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── store/           # Redux store configuration
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
└── package.json         # Project dependencies
```

## 🔍 Key Features Implementation

### Search with Debouncing

The search functionality includes debouncing to optimize API calls, only searching after the user stops typing for 500ms.

### Redux State Management

- **Search State**: Manages search queries, results, and pagination
- **Favorites State**: Stores and persists user's favorite movies
- **Genre Movies State**: Caches genre-specific movie collections

### Responsive UI

The application is designed to work seamlessly across all device sizes, from mobile phones to large desktop displays.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [OMDb API](https://www.omdbapi.com/) for providing movie data
- [Lucide Icons](https://lucide.dev/) for beautiful UI icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vercel](https://vercel.com/) for hosting the application

---

Made with ❤️ by Sid
