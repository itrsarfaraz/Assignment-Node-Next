# E-Commerce Application

A full-stack e-commerce application built with Next.js frontend and Node.js backend.

## Project Structure

```
Assignment/
├── frontend/          # Next.js frontend application
└── backend/          # Node.js backend application
```

## Prerequisites

- Node.js (v23)
- MySQL
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```env
PORT=3001
JWT_SECRET=your_jwt_secret_key
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=ecommerce_db
```
4. Importing the Database
To set up the database for this project:

1. Locate the database.sql file in the backend folder.
2. Use your preferred database management tool to create a new database.
3. Import the database.sql file into the newly created database.
4. Update the database credentials in the .env file to match your database configuration.
5. Verify the connection by starting the backend server.


5. Start the backend server:

```bash
# For development
npm run dev

```

The backend server will start on http://localhost:3001

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Start the frontend development server:
```bash
npm run dev

```

The frontend application will be available at http://localhost:3000



