# Project Documentation: Implementation of Issue #5 (User Registration & Login)

- **Target Repository:** [vikash2006-dot/Student-Management-System](https://github.com/vikash2006-dot/Student-Management-System)
- **Resolved Issue:** [Issue #5: Implement basic user registration and login functionality](https://github.com/vikash2006-dot/Student-Management-System/issues/5)
- **Branch:** `feature/user-auth`
- **Author:** Mani7527 (Manikesh)

---

## 📑 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Issue Requirements & Compliance Checklist](#2-issue-requirements--compliance-checklist)
3. [Backend Implementation & Code Explanation](#3-backend-implementation--code-explanation)
   - [`backend/src/models/User.js`](#backend-models-userjs)
   - [`backend/src/middleware/authMiddleware.js`](#backend-middleware-authmiddlewarejs)
   - [`backend/src/controllers/authController.js`](#backend-controllers-authcontrollerjs)
   - [`backend/src/routes/authRoutes.js`](#backend-routes-authroutesjs)
   - [`backend/src/server.js`](#backend-src-serverjs)
4. [Frontend Implementation & Code Explanation](#4-frontend-implementation--code-explanation)
   - [`frontend/src/pages/Register.jsx`](#frontend-pages-registerjsx)
   - [`frontend/src/pages/Login.jsx`](#frontend-pages-loginjsx)
   - [`frontend/src/components/Navbar.jsx`](#frontend-components-navbarjsx)
   - [`frontend/src/services/api.js`](#frontend-services-apijs)
   - [`frontend/src/App.jsx`](#frontend-src-appjsx)
   - [`frontend/src/index.css`](#frontend-src-indexcss)
5. [Localhost Verification & Security Validation](#5-localhost-verification--security-validation)
6. [Ready-to-Run Git Commands for 6:00 AM Push](#6-ready-to-run-git-commands-for-600-am-push)

---

## 1. Executive Summary

This feature adds a complete, secure, beginner-friendly **Authentication System** (User Registration, Login, and Session Management) to the Student Management System.

Prior to this implementation, any visitor had open access to the app without authentication. Following standard web development practices, this update:
1. Adds **User Registration** with validation and bcrypt password hashing.
2. Adds **User Login** with credential verification and JWT generation.
3. Protects backend API routes using a custom **JWT Authentication Middleware**.
4. Persists the authentication session on the frontend via `localStorage` and provides a clean **Logout** mechanism.
5. Displays dynamic user status in the navigation bar (`👋 <User Name>` + Logout button).

---

## 2. Issue Requirements & Compliance Checklist

| Requirement / Acceptance Criteria | Status | Implementation Details |
| :--- | :---: | :--- |
| **Registration Form** | ✅ Completed | Created [`Register.jsx`](file:///Users/manikeskumar/Desktop/Student-Management-System/frontend/src/pages/Register.jsx) with Name, Email, Password, Confirm Password. |
| **Login Form** | ✅ Completed | Created [`Login.jsx`](file:///Users/manikeskumar/Desktop/Student-Management-System/frontend/src/pages/Login.jsx) with Email and Password inputs. |
| **Validate Required Fields** | ✅ Completed | Validates required inputs and password length on both frontend and backend. |
| **Secure Password Hashing** | ✅ Completed | Uses `bcryptjs` (salt rounds = 10). Passwords are never stored as plain text. |
| **Authenticate Users with JWT** | ✅ Completed | Generates JWT signed with `JWT_SECRET` (expires in 7 days). |
| **Secure Storage & Logout** | ✅ Completed | Stores JWT in browser `localStorage`. Logout purges token and resets user state. |
| **Error Handling & Feedback** | ✅ Completed | Returns explicit HTTP status codes (`400`, `401`, `200`, `201`) with clear error messages. |
| **POST `/api/auth/register`** | ✅ Completed | Handled by `registerUser` controller in [`authController.js`](file:///Users/manikeskumar/Desktop/Student-Management-System/backend/src/controllers/authController.js). |
| **POST `/api/auth/login`** | ✅ Completed | Handled by `loginUser` controller in [`authController.js`](file:///Users/manikeskumar/Desktop/Student-Management-System/backend/src/controllers/authController.js). |
| **Protected Backend Routes** | ✅ Completed | Created `protect` middleware in [`authMiddleware.js`](file:///Users/manikeskumar/Desktop/Student-Management-System/backend/src/middleware/authMiddleware.js) and verified on `GET /api/auth/me`. |

---

## 3. Backend Implementation & Code Explanation

### Backend: Models (`User.js`)
- **File:** `backend/src/models/User.js`
- **Purpose:** Defines the Mongoose Schema for stored users.
- **Code Highlights:**
  ```javascript
  const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: [true, 'Please enter your name'], trim: true },
      email: { type: String, required: [true, 'Please enter your email address'], unique: true, lowercase: true, trim: true },
      password: { type: String, required: [true, 'Please enter a password'], minlength: 6 }
    },
    { timestamps: true }
  );
  ```
- **Rationale:** 
  - `unique: true` enforces email uniqueness at the MongoDB database index level.
  - `lowercase: true` ensures case-insensitive email comparison.

---

### Backend: Middleware (`authMiddleware.js`)
- **File:** `backend/src/middleware/authMiddleware.js`
- **Purpose:** Protects routes by validating JSON Web Tokens sent in incoming request headers.
- **How It Works:**
  1. Inspects the `Authorization` header for `Bearer <token>`.
  2. If missing, responds with `401 Unauthorized`.
  3. Uses `jwt.verify(token, secret)` to validate token integrity and expiration.
  4. Fetches the user from MongoDB and attaches it to `req.user` (excluding the hashed password).
  5. Calls `next()` to proceed to the controller.

---

### Backend: Controllers (`authController.js`)
- **File:** `backend/src/controllers/authController.js`
- **Key Functions:**
  1. **`registerUser`:**
     - Checks if required fields are present.
     - Checks if email is already registered (`User.findOne({ email })`) &rarr; returns `400 Bad Request` if duplicate.
     - Hashes password: `const salt = await bcrypt.genSalt(10); const hashedPassword = await bcrypt.hash(password, salt);`.
     - Creates user and returns JWT token: `{ success: true, token, user }`.
  2. **`loginUser`:**
     - Finds user by email.
     - Verifies password using `await bcrypt.compare(password, user.password)`.
     - Returns `401 Unauthorized` if invalid.
     - Returns JWT token on success.
  3. **`getMe`:**
     - Protected handler returning `req.user`.

---

### Backend: Routes (`authRoutes.js`)
- **File:** `backend/src/routes/authRoutes.js`
- **Endpoints Defined:**
  - `POST /register` &rarr; `registerUser`
  - `POST /login` &rarr; `loginUser`
  - `GET /me` &rarr; `protect, getMe` (verifies token authentication)

---

### Backend: Server Integration (`server.js`)
- **File:** `backend/src/server.js`
- **Integration:**
  ```javascript
  const authRoutes = require('./routes/authRoutes');
  // Authentication routes
  app.use('/api/auth', authRoutes);
  ```

---

## 4. Frontend Implementation & Code Explanation

### Frontend: Register Page (`Register.jsx`)
- **File:** `frontend/src/pages/Register.jsx`
- **Features:**
  - Controlled inputs for Name, Email, Password, and Confirm Password using `useState`.
  - Client-side validation ensuring passwords match and meet the 6-character requirement.
  - Submits to `POST /api/auth/register`.
  - On successful registration, stores `token` and `user` into `localStorage`, displays a success banner, and redirects to Dashboard.

---

### Frontend: Login Page (`Login.jsx`)
- **File:** `frontend/src/pages/Login.jsx`
- **Features:**
  - Clean login form with Email and Password inputs.
  - Submits to `POST /api/auth/login`.
  - Captures any error from the backend (e.g. `"Invalid email or password"`) and displays it in a red alert banner.
  - On success, persists session and redirects to Dashboard.

---

### Frontend: Navigation Bar (`Navbar.jsx`)
- **File:** `frontend/src/components/Navbar.jsx`
- **Features:**
  - Reads `currentUser` from `localStorage`.
  - **Logged In State:** Shows user name (`👋 <Name>`) and a red **Logout** button.
  - **Logged Out State:** Shows navigation links for **Login** and **Register**.
  - **Logout Action:** Purges `localStorage.removeItem('token')` and `localStorage.removeItem('user')`, then redirects to `/login`.

---

### Frontend: Axios Client Interceptor (`api.js`)
- **File:** `frontend/src/services/api.js`
- **Features:**
  - Added an Axios request interceptor:
    ```javascript
    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    ```
  - Any future API request automatically includes the user's JWT token in the `Authorization` header.

---

### Frontend: Routing & Styling (`App.jsx` & `index.css`)
- **`App.jsx`:** Registered routes for `/login` and `/register`.
- **`index.css`:** Added styles for auth cards, links, user greeting chips, and the logout button.

---

## 5. Localhost Verification & Security Validation

### Security Checks Performed:
1. **Password Hashing in MongoDB:**
   - Querying MongoDB confirmed password format:
     `password: '$2b$10$WATPxerp/13l70f4CJDmdentCq6jtVuAS3L23ReyYWTz7xFpYFl96'`
   - Plain-text passwords are never stored.
2. **Duplicate Email Rejection:**
   - Attempting duplicate registration returned `400 Bad Request`:
     `{"success":false,"message":"An account with this email already exists. Please log in instead."}`
3. **Protected Route Token Validation:**
   - Request to `GET /api/auth/me` without token returned `401 Unauthorized`:
     `{"success":false,"message":"Access denied. Please log in first."}`
   - Request with valid JWT returned `200 OK` with user payload.
4. **End-to-End User Journey:**
   - Registered test user `Anita Roy` &rarr; Redirected to Dashboard &rarr; Navbar greeted user &rarr; Logged out &rarr; Re-logged in successfully.

---

## 6. Ready-to-Run Git Commands for 6:00 AM Push

As instructed, **no commits have been made yet**. When you are ready to commit and push at **6:00 AM**, run these commands in your terminal:

```bash
# 1. Verify all modified and untracked files
git status

# 2. Stage the authentication and route protection files
git add backend/package.json \
        backend/package-lock.json \
        backend/src/models/User.js \
        backend/src/middleware/authMiddleware.js \
        backend/src/controllers/authController.js \
        backend/src/routes/authRoutes.js \
        backend/src/routes/studentRoutes.js \
        backend/src/server.js \
        frontend/index.html \
        frontend/src/services/api.js \
        frontend/src/pages/Register.jsx \
        frontend/src/pages/Login.jsx \
        frontend/src/pages/Students.jsx \
        frontend/src/components/Navbar.jsx \
        frontend/src/App.jsx \
        frontend/src/index.css \
        ISSUE_2_DOCUMENTATION.md

# 3. Commit with issue reference
git commit -m "feat: implement user registration and login functionality (closes #5)"

# 4. Push to your GitHub fork
git push -u origin feature/user-auth

# 5. Create Pull Request using GitHub CLI (or through GitHub website)
gh pr create \
  --repo vikash2006-dot/Student-Management-System \
  --base main \
  --head Mani7527:feature/user-auth \
  --title "feat: Implement user registration and login functionality (#5)" \
  --body "## Description
Implements user registration and login functionality using JWT and bcrypt for Issue #5.

## Changes Made
- User model with Mongoose schema
- Password hashing with bcryptjs (salt rounds: 10)
- User registration and login API endpoints with JWT tokens
- Auth middleware protecting private routes
- Frontend Register and Login pages with responsive forms
- Session persistence in localStorage and Logout functionality
- Dynamic user status in Navbar

Closes #5"
```
