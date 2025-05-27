# Movies Database Application

A modern web application built with React, TypeScript, and Vite for managing and displaying movies information.

## Features

- Modern and responsive UI built with Tailwind CSS
- TypeScript for type safety and better development experience
- Fast development experience with Vite
- Real-time search and filtering capabilities
- Movie details display with images and descriptions
- Local storage for persisting favorite movies
- Responsive design that works on all devices

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- ESLint for code quality
- PostCSS for CSS processing

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/MostafaHussien2000/movies-db.git
cd movies-db
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Environment Variables

Create a `.env.local` file in the root directory and add your environment variables:

```
VITE_TMDB_API_KEY=your_api_key_here
```

## Available Scripts

- `npm run dev` - Starts the development server with hot module replacement
- `npm run build` - Builds the application for production
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint for code linting

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── App.tsx        # Main application component
```

## Possible Enhancements

1. **User Authentication**

   - Add user registration and login system
   - Implement user-specific favorites and watchlists

2. **Advanced Search**

   - Add more filtering options (genres, release year, rating)
   - Implement fuzzy search for better results

3. **Movie Details**

   - Add movie trailers and video content
   - Implement user reviews and ratings
   - Add cast and crew information

4. **Performance Optimizations**

   - Implement pagination for large movie lists
   - Add image lazy loading
   - Implement caching for API responses

5. **Additional Features**
   - Add movie recommendations system
   - Implement watchlist functionality
   - Add movie trailers and video content
   - Implement user reviews and ratings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
