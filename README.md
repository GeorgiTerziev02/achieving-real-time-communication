# Advanced WebSocket Demo

A sophisticated Node.js application demonstrating advanced concepts with WebSocket, TypeScript, MongoDB, and modern security practices.

## Features

- Real-time bidirectional communication using WebSocket
- TypeScript for type safety and better developer experience
- MongoDB integration with Mongoose
- JWT authentication
- Advanced security features
- Comprehensive logging system
- Environment-based configuration
- Performance optimizations
- Error handling
- RESTful API design

## Advanced Node.js Concepts

### 1. TypeScript Integration
- Strong typing for better code quality and developer experience
- Interface definitions for data structures (e.g., `IMessage`, `JWTPayload`)
- Type checking during development to catch errors early
- Enhanced IDE support with code completion and inline documentation
- Path aliases for cleaner imports (`@/*`)

### 2. Advanced Project Structure
- Modular architecture with clear separation of concerns
- Organized directory structure:
  - `config/`: Environment and application configuration
  - `middleware/`: Express middleware components
  - `models/`: Database schemas and models
  - `services/`: Business logic and service layer
  - `types/`: TypeScript type definitions
  - `utils/`: Utility functions and helpers

### 3. Security Features
- Helmet for secure HTTP headers
- Rate limiting to prevent abuse and DDoS attacks
- JWT authentication for secure API access
- CORS protection to control cross-origin requests
- Input validation and sanitization
- Secure credential management with environment variables

### 4. Database Integration
- MongoDB with Mongoose ODM
- Schema validation with TypeScript interfaces
- Indexing for query performance optimization
- Error handling for database operations
- Connection pooling and management

### 5. Logging and Monitoring
- Winston logger with multiple transports
- Configurable log levels (error, warn, info, http, debug)
- File-based logging for errors and all logs
- Console logging with colorization
- Structured log format with timestamps

### 6. WebSocket Implementation
- Real-time bidirectional communication
- Connection lifecycle management
- Error handling for WebSocket events
- Message broadcasting to multiple clients
- JSON message format with type validation

### 7. Environment Configuration
- Environment variables with dotenv
- Configuration validation for required variables
- Different environments (development/production)
- Secure credential management
- Type-safe configuration access

### 8. Performance Optimization
- Response compression with compression middleware
- Database indexing for faster queries
- Rate limiting to prevent server overload
- Connection pooling for database efficiency
- Efficient error handling to prevent memory leaks

### 9. Error Handling
- Global error middleware for unhandled exceptions
- Try-catch blocks for async operations
- Structured error logging
- Client-friendly error messages
- Error type differentiation

### 10. API Design
- RESTful endpoints with proper HTTP methods
- Authentication middleware for protected routes
- Request validation
- Consistent response formatting
- API versioning support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values as needed

3. Start MongoDB:
   - Ensure MongoDB is running locally or update the connection string

4. Build the TypeScript code:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

6. For development with hot reloading:
```bash
npm run dev
```

## Project Structure

- `src/server.ts` - Main application entry point
- `src/config/index.ts` - Configuration management
- `src/middleware/auth.ts` - Authentication middleware
- `src/models/Message.ts` - MongoDB message model
- `src/utils/logger.ts` - Logging utility
- `public/` - Static frontend files

## How to Use

1. Open the application in multiple browser windows to simulate different clients
2. Type a message in the input field and press Enter or click Send
3. Messages will be broadcast to all connected clients except the sender
4. Use the REST API to fetch message history (requires authentication)

## API Endpoints

- `GET /api/messages` - Fetch recent messages (requires authentication)
- WebSocket connection at `ws://localhost:3000` for real-time messaging 