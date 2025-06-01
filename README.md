# Company Name Generator Chat Application

## Overview

This project is a Next.js-based chat application that helps users generate and evaluate company name suggestions. It provides a multilingual interface (French and Arabic) for users to interact with an AI assistant that specializes in generating company name suggestions.

## Features

- **Interactive Chat Interface**: Communicate with an AI assistant to generate company name suggestions
- **Multilingual Support**: Switch between French and Arabic languages
- **Company Name Suggestions**: Receive suggestions with both French and Arabic versions
- **Feedback System**: Provide feedback on name suggestions (thumbs up/down)
- **Chat History**: View and manage previous chat sessions
- **PDF Viewer**: View reference documents related to company naming
- **Real-time Processing**: Visual indication of AI processing steps

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Hooks
- **API Communication**: Fetch API
- **Backend**: Local API server (Node.js)
- **Database**: Prisma with local database

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd hack-rne
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up the database:
   ```
   npx prisma generate
   ```

## Running the Application

### Start the Backend Server

The application requires a backend server running on port 5000. Start the server:

```
# In a separate terminal
cd server
npm install
npm start
```

### Start the Frontend Development Server

```
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Build for Production

To build the application for production:

```
npm run build
# or
yarn build
```

To start the production server:

```
npm run start
# or
yarn start
```

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: React components
  - `/chat`: Chat-related components (interface, messages, sidebar)
  - `/ui`: Reusable UI components
- `/lib`: Utility functions and types
  - `/api-client.ts`: API client for backend communication
  - `/hooks`: Custom React hooks
  - `/types.ts`: TypeScript type definitions
  - `/translations.ts`: Multilingual text content
- `/prisma`: Database schema and client
- `/public`: Static assets
- `/styles`: Global CSS styles

## Key Features Explained

### Chat Interface

The main chat interface allows users to:
- Send messages to the AI assistant
- View AI-generated company name suggestions
- Provide feedback on suggestions
- Request more suggestions
- Switch between languages

### Company Name Generation

The application specializes in generating company names with:
- French and Arabic translations
- Availability status
- Quality score
- Option to request additional suggestions

### Session Management

Users can:
- Create new chat sessions
- View previous chat history
- Switch between different chat sessions
- Delete unwanted sessions

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
