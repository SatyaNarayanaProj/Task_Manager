# Full-Stack Task Manager (Go + React + MongoDB)

This is a complete, full-stack Task Management application built to manage daily tasks securely. It utilizes a modern tech stack with clear separation between the API, data layer, and presentation layer.

## 🚀 Tech Stack

* **Backend:** Go (Gin Framework)
* **Database:** MongoDB
* **Frontend:** React.js (Vite, Functional Components, Hooks)
* **Authentication:** JWT (JSON Web Token) with secure **bcrypt** password hashing

---

## 📂 Project Structure (Monorepo)

The repository follows a clean structure, containing two main applications:

/Task_Manager/ |-- /task-manager-backend/ (Go API & Logic) |-- /task-manager-frontend/ (React UI) |-- README.md (You are here)


---

## 🛠️ Local Setup & Installation

You must run the **Backend** and **Frontend** simultaneously in two separate terminals.

### Prerequisites

Ensure the following tools are installed on your system:

1.  **Go:** [Install Go](https://go.dev/dl/) (version 1.21 or later)
2.  **Node.js & npm:** [Install Node.js](https://nodejs.org/en) (version 18 or later)
3.  **MongoDB:** The MongoDB Community Server must be installed and running locally on the default port (`27017`).

### Step 1: Backend Setup (Go API)

Open your **first terminal** and run these commands:

```bash
# 1. Navigate into the backend directory
cd task-manager-backend

# 2. Install Go dependencies
go mod tidy

# 3. Create your environment file
# Create a file named ".env" inside this folder and add:
# ----------------------------------------------------
# MONGO_URI=mongodb://localhost:27017
# JWT_SECRET=your_super_secret_key_that_is_at_least_32_chars_long
# ----------------------------------------------------

# 4. Run the Go server
go run main.go
The backend should output: Connected to MongoDB! and Starting server on :8080...
```
### Step 2: Frontend Setup (React UI)
Open your second terminal and run these commands:

``` bash
# 1. Navigate into the frontend directory
cd task-manager-frontend

# 2. Install Node.js dependencies
npm install

# 3. Run the React development server
npm run dev -- --port 3000
```
## User-Interface

<img width="616" height="684" alt="Screenshot 2025-10-28 232404" src="https://github.com/user-attachments/assets/367ae865-0e7b-4f66-b2db-59e54f20f8ee" />

<img width="999" height="638" alt="Screenshot 2025-10-28 232442" src="https://github.com/user-attachments/assets/0f49cf5e-4cac-448c-a176-a48852c7eb3b" />

