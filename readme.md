# Smart Communication Hub Backend

A Node.js application built with Express.js, Prisma, and TypeScript. This project provides APIs for authentication, user management, messaging, and insights.

## Features

- **Authentication**: User login and registration.
- **User Management**: Manage user profiles and data.
- **Messaging**: Send and receive messages.
- **Insights**: Generate insights using AI services.
- **Prisma ORM**: Database management with migrations.
- **TypeScript**: Type-safe development.

## Prerequisites

- Node.js
- npm or yarn
- PostgreSQL (or your preferred database)

## Database Structure

The database is managed using Prisma ORM. Below is an overview of the main entities and their relationships:

### Entities

1. **User**
   - Fields:
     - `id` (Primary Key)
     - `name` (String)
     - `email` (String, Unique)
     - `password` (String)
     - `createdAt` (DateTime)
     - `updatedAt` (DateTime)
   - Description: Represents the users of the system.

2. **Message**
   - Fields:
     - `id` (Primary Key)
     - `content` (String)
     - `senderId` (Foreign Key to User)
     - `receiverId` (Foreign Key to User)
     - `createdAt` (DateTime)
   - Description: Represents messages sent between users.

3. **Insight**
   - Fields:
     - `id` (Primary Key)
     - `userId` (Foreign Key to User)
     - `data` (JSON or String)
     - `createdAt` (DateTime)
   - Description: Represents analytical data or insights associated with a user.

### Relationships

- **User ↔ Message**:
  - Relationship: One-to-Many (A user can send and receive multiple messages).
- **User ↔ Insight**:
  - Relationship: One-to-Many (A user can have multiple insights).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mohamedkhaled2310/smart-communication-hub-backend.git
   cd smart-communication-hub-backend

2. Install dependencies:
   ```bash
   npm install

3. Set up environment variables: Create a .env file in the root directory and configure the following variables:
   ```bash
   DATABASE_URL=your-database-url
   JWT_SECRET=your-jwt-secret
   AI_API_KEY=your-ai-api-key

## Usage

1. Start the development server:
   ```bash
    npm run dev
