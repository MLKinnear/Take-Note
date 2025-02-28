SETUP:

-The following data must be added a .env file for App function and security

PORT=5000
MONGO_URI=mongodb://localhost:27017/notetaking
JWT_SECRET=my_secret_key
JWT_EXPIRES_IN=1h
NODE_ENV=development (for added data logging "development" or less logging for "production")

-node_modules must be installed as well for proper functionality.
_________________
_________________
API Documentation
Base URL: http://localhost:5000/

___________
AUTH ROUTES

*Register
Endpoint: POST /api/auth/register
Description: Registers a new user
Authentication: Not required
Request Body: JSON
{
  "username": "abc",
  "email": "abc@abc.com",
  "password": "abc"
}
Response:
    Status 200: Redirects to /login with a success message.
Error:
    Status 409 Conflict: Email already exists. Renders /register with an error message.
    Status 500 Internal Server Error: Renders /register with an error message.

*Login
Endpoint: POST /api/auth/login
Description: Logs in a user and assigns a JWT token stored in cookies.
Authentication: Not required
Request Body: JSON
{
  "email": "abc@abc.com",
  "password": "abc"
}
Response:
    Status 200: Redirects to /notes, sets JWT token in cookies.
Error:
    404 Not Found: User not found. Renders /login with an error message.
    401 Unauthorized: Invalid credentials. Renders /login with an error message.
    500 Internal Server Error: Returns a JSON response with the error message.

*Logout
Endpoint: POST /api/auth/logout
Description: Logs out a user by clearing the JWT token from cookies.
Authentication: Required
Request Body: None
Response:
    Status 200 JSON
{ "message": "Logged out successfully" }
Error Response: None

___________
NOTE ROUTES

All note-related routes require authentication. The user must be logged in with a valid token in cookies.

*Get All Notes
Endpoint: GET /notes
Description: Fetches all notes for the logged-in user.
Authentication: Required
Request Body: None
Response:
    Status 200: Renders /notes with the list of notes.
Error:
    500 Internal Server Error: JSON response with an error message.

*Get a Specific Note
Endpoint: GET /notes/:id
Description: Fetches a specific note by its ID.
Authentication: Required
Request Body: None
Response:
    Status 200: Renders /note with the note details.
Error:
    404 Not Found: Note not found.
    500 Internal Server Error: JSON response with an error message.

*Create a Note
Endpoint: POST /notes/create
Description: Creates a new note for the logged-in user.
Authentication: Required
Request Body: JSON
{
  "title": "Sample Note",
  "description": "This is a test note",
  "pinned": true
}
Response:
    Status 201: Redirects to /notes after successful creation.
Error:
    400 Bad Request: Renders /create with a validation error message.
    500 Internal Server Error: JSON response with an error message.

*Update a Note
Endpoint: PUT /notes/:id
Description: Updates an existing note.
Authentication: Required
Request Body: JSON
{
  "title": "Updated Note",
  "description": "Updated description",
  "pinned": false
}
Response:
    Status 200: Redirects to /notes.
Error:
    404 Not Found: Note not found.
    400 Bad Request: Renders /update with validation errors.
    500 Internal Server Error: JSON response with an error message.

*Delete a Note
Endpoint: DELETE /notes/:id
Description: Deletes a note.
Authentication: Required
Request Body: None
Response:
    Status 200: JSON
{ "message": "Note deleted successfully" }
Error:
    404 Not Found: Note not found.
    500 Internal Server Error: JSON response with an error message.

__________
MIDDLEWARE

Authentication Middleware (isAuthenticated)
-Protects routes by verifying JWT tokens.
-If a token is missing or invalid, it returns:
    401 Unauthorized: "No token provided."
    403 Forbidden: "Invalid token."
Error Handling Middleware
-Logs errors in development.
-Returns a structured JSON error response in production.

______
MODELS

User Model
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }

-Pre-save middleware: Hashes passwords before storing.
-Instance method: Compares hashed passwords.

Note Model
    title: { type: String, required: true, trim: true },
    description: {
        type: String,
        required: [true, 'A note is required'],
        minlength: [5, 'Min 5 characters'],
        maxlength: [500, 'Max 500 characters']
    },
    pinned: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

Validation
-Title and description are required.
-Description has min/max length limits.

___________________
AUTHENTICATION FLOW

1. User registers => Redirects to /login.
2. User logs in => JWT token is stored in cookies => Redirects to /notes.
3. User accesses notes => Authentication middleware checks the token.
4. User logs out => Token is cleared from cookies.

_____________________
_____________________
REFLECTION STATEMENT:

This midterm project has been one of the most time consuming projects I have ever done.
I spent probably three full days working on my app with the intention of building a task and client creation app.
After battling the authentication and login aspect first, I felt completely defeated.
The statement "Keep it simple, stupid" rang loud.
I decided to print out the project outline and rubric and follow it like work instructions.
This worked very well. Besides all the code writing and learning,
the biggest thing I am taking away from this project is to not go rogue and keep it simple!
