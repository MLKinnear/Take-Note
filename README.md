## Setup

The following environment variables must be added to a `.env` file for the app to function securely:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/notetaking
JWT_SECRET=my_secret_key
JWT_EXPIRES_IN=1h
NODE_ENV=development  # Use "development" for detailed logging or "production" for less logging
```

Additionally, make sure to install `node_modules` for proper functionality.

---

## API Documentation

### Base URL
```
http://localhost:5000/
```

---

## Auth Routes

### Register
- **Endpoint:** `POST /api/auth/register`
- **Description:** Registers a new user.
- **Authentication:** Not required.
- **Request Body (JSON):**
  ```json
  {
    "username": "abc",
    "email": "abc@abc.com",
    "password": "abc"
  }
  ```
- **Response:**
  - `200 OK`: Redirects to `/login` with a success message.
- **Errors:**
  - `409 Conflict`: Email already exists. Renders `/register` with an error message.
  - `500 Internal Server Error`: Renders `/register` with an error message.

### Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Logs in a user and assigns a JWT token stored in cookies.
- **Authentication:** Not required.
- **Request Body (JSON):**
  ```json
  {
    "email": "abc@abc.com",
    "password": "abc"
  }
  ```
- **Response:**
  - `200 OK`: Redirects to `/notes`, sets JWT token in cookies.
- **Errors:**
  - `404 Not Found`: User not found. Renders `/login` with an error message.
  - `401 Unauthorized`: Invalid credentials. Renders `/login` with an error message.
  - `500 Internal Server Error`: JSON response with an error message.

### Logout
- **Endpoint:** `POST /api/auth/logout`
- **Description:** Logs out a user by clearing the JWT token from cookies.
- **Authentication:** Required.
- **Request Body:** None.
- **Response:**
  ```json
  { "message": "Logged out successfully" }
  ```
- **Errors:** None.

---

## Note Routes

> All note-related routes require authentication. The user must be logged in with a valid token in cookies.

### Get All Notes
- **Endpoint:** `GET /notes`
- **Description:** Fetches all notes for the logged-in user.
- **Authentication:** Required.
- **Response:**
  - `200 OK`: Renders `/notes` with the list of notes.
- **Errors:**
  - `500 Internal Server Error`: JSON response with an error message.

### Get a Specific Note
- **Endpoint:** `GET /notes/:id`
- **Description:** Fetches a specific note by its ID.
- **Authentication:** Required.
- **Response:**
  - `200 OK`: Renders `/note` with the note details.
- **Errors:**
  - `404 Not Found`: Note not found.
  - `500 Internal Server Error`: JSON response with an error message.

### Create a Note
- **Endpoint:** `POST /notes/create`
- **Description:** Creates a new note for the logged-in user.
- **Authentication:** Required.
- **Request Body (JSON):**
  ```json
  {
    "title": "Sample Note",
    "description": "This is a test note",
    "pinned": true
  }
  ```
- **Response:**
  - `201 Created`: Redirects to `/notes` after successful creation.
- **Errors:**
  - `400 Bad Request`: Renders `/create` with a validation error message.
  - `500 Internal Server Error`: JSON response with an error message.

### Update a Note
- **Endpoint:** `PUT /notes/:id`
- **Description:** Updates an existing note.
- **Authentication:** Required.
- **Request Body (JSON):**
  ```json
  {
    "title": "Updated Note",
    "description": "Updated description",
    "pinned": false
  }
  ```
- **Response:**
  - `200 OK`: Redirects to `/notes`.
- **Errors:**
  - `404 Not Found`: Note not found.
  - `400 Bad Request`: Renders `/update` with validation errors.
  - `500 Internal Server Error`: JSON response with an error message.

### Delete a Note
- **Endpoint:** `DELETE /notes/:id`
- **Description:** Deletes a note.
- **Authentication:** Required.
- **Response:**
  ```json
  { "message": "Note deleted successfully" }
  ```
- **Errors:**
  - `404 Not Found`: Note not found.
  - `500 Internal Server Error`: JSON response with an error message.

---

## Middleware

### Authentication Middleware (`isAuthenticated`)
- Protects routes by verifying JWT tokens.
- If a token is missing or invalid, it returns:
  - `401 Unauthorized`: "No token provided."
  - `403 Forbidden`: "Invalid token."

### Error Handling Middleware
- Logs errors in development.
- Returns a structured JSON error response in production.

---

## Models

### User Model
```js
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}
```
- **Pre-save middleware:** Hashes passwords before storing.
- **Instance method:** Compares hashed passwords.

### Note Model
```js
{
  title: { type: String, required: true, trim: true },
  description: {
    type: String,
    required: [true, 'A note is required'],
    minlength: [5, 'Min 5 characters'],
    maxlength: [500, 'Max 500 characters']
  },
  pinned: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}
```
- **Validation:**
  - Title and description are required.
  - Description has min/max length limits.

---

## Authentication Flow

1. User registers → Redirects to `/login`.
2. User logs in → JWT token is stored in cookies → Redirects to `/notes`.
3. User accesses notes → Authentication middleware checks the token.
4. User logs out → Token is cleared from cookies.

---

## Reflection Statement

This midterm project has been one of the most time-consuming projects I have ever done. I spent three days working on the first iteration, intending to build a task and client creation app.

After battling the authentication and login aspect first, and running into nothing but problems, I felt completely defeated. The statement **"Keep it simple, stupid"** rang loud. I decided to print out the project outline and rubric and follow it like work instructions. This approach worked very well.

Besides all the coding and learning, the biggest takeaway from this project is to **not go rogue and keep it simple**!

