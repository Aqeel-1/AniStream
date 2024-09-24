# AniStream: Anime Streaming API

AniStream is a RESTful API for managing anime data, user interactions, and streaming services. Built with Node.js, Express, and MongoDB, AniStream is designed to provide backend functionality for an anime streaming website.

## Features

- **Anime Catalog Management**: Add, update, delete, and retrieve anime titles.
- **User Management**: Support for user accounts, watchlists, and favorites.
- **Streaming Endpoints**: API endpoints to serve anime episodes.
- **Secure Authentication**: JWT-based authentication for securing API endpoints.
- **Modern Code Standards**: Follows best practices with ESLint (Airbnb style) and Prettier for code formatting.
- **Error Handling & Validation**: Robust error handling and input validation with Express.

## Tech Stack

- **Node.js** (Express framework)
- **MongoDB** (Mongoose for data modeling)
- **ESLint** (Airbnb style guide)
- **Prettier** (For consistent code formatting)
- **JWT** (JSON Web Tokens for authentication)

## Installation & Setup

### Prerequisites

- Node.js (v14.x or above)
- MongoDB

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/AniStream.git
   cd AniStream
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file at the root of your project and add the following environment variables:

   ```bash
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Your API will be running at `http://localhost:3000` by default.

## API Endpoints

Here’s a basic overview of the main endpoints:

- `GET /api/anime` – Retrieve a list of all anime titles.
- `GET /api/anime/:id` – Retrieve details of a specific anime.
- `POST /api/anime` – Add a new anime (Admin only).
- `PUT /api/anime/:id` – Update anime information (Admin only).
- `DELETE /api/anime/:id` – Delete an anime (Admin only).

## Project Structure

```
AniStream/
├── models/           # Mongoose models for anime, users, etc.
├── routes/           # API routes
├── controllers/      # Request handlers (business logic)
├── middleware/       # Custom middleware (authentication, error handling)
├── utils/            # Utilities (custom errors, custom query calsses, etc.)
├── .eslintrc.json    # ESLint configuration
├── .prettierrc       # Prettier configuration
├── server.js         # Main entry point
├── app.js            # Containing the main routes
└── README.md         # Project documentation
```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and create a pull request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.
