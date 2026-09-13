TODO LIST APP - HOW TO RUN
============================

1. Make sure Node.js and PostgreSQL are installed and PostgreSQL is
   running.

2. Create a database:
   - Open pgAdmin
   - In the left sidebar, right-click "Databases" under your server
   - Click "Create" > "Database..."
   - Name it "auth_sys" and click "Save"
   - Click on "auth_sys", then open the Query Tool (Tools > Query Tool)
   - Paste and run this SQL:

     CREATE TABLE users (
         id SERIAL PRIMARY KEY,
         name TEXT NOT NULL,
         email TEXT UNIQUE NOT NULL,
         password TEXT NOT NULL
     );

     CREATE TABLE todos (
         id SERIAL PRIMARY KEY,
         user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
         text TEXT NOT NULL,
         completed BOOLEAN DEFAULT FALSE,
         created_at TIMESTAMP DEFAULT NOW()
     );

3. Open a terminal in the "backend" folder.

4. Run:

     npm install express pg bcryptjs jsonwebtoken cookie-parser cors dotenv nodemon

5. Please fill in your own database password
   and any other values in the .env file.

6. Run:  npm run dev

7. Open your browser to:  http://localhost:5000
