# Project Management Form using JsonPowerDB

A web-based Project Management Form that performs CRUD operations using **JsonPowerDB** as the database backend. Built as a college micro project demonstrating database integration through a clean, responsive form interface.

![Project Status](https://img.shields.io/badge/Status-Complete-brightgreen)
![Database](https://img.shields.io/badge/Database-JsonPowerDB-blue)
![Deployment](https://img.shields.io/badge/Deploy-Netlify-00C7B7)

---

## Table of Contents

1. [Project Description](#project-description)
2. [Objective](#objective)
3. [Features](#features)
4. [Technologies Used](#technologies-used)
5. [About JsonPowerDB](#about-jsonpowerdb)
6. [Database Structure](#database-structure)
7. [Application Workflow](#application-workflow)
8. [Project Folder Structure](#project-folder-structure)
9. [Installation and Setup](#installation-and-setup)
10. [Database Configuration](#database-configuration)
11. [Running Locally](#running-locally)
12. [Deployment on Netlify](#deployment-on-netlify)
13. [Testing Instructions](#testing-instructions)
14. [Screenshots](#screenshots)
15. [Project Status](#project-status)
16. [Author](#author)

---

## Project Description

This application provides a form-based interface to manage project records. Users can create new project entries, retrieve existing records by their unique Project-ID, update project details, and reset the form. All data is persisted in a **JsonPowerDB** database.

The application uses a **Netlify serverless function** as a secure backend proxy, ensuring that the database connection token is never exposed in the frontend code.

## Objective

- Demonstrate CRUD (Create, Read, Update) operations using JsonPowerDB.
- Build a responsive, professional web form with proper validation and state management.
- Implement secure database communication through a serverless backend.
- Create a deployable, submission-ready micro project.

## Features

| Feature | Description |
|---|---|
| **Primary Key Lookup** | Automatically checks if a Project-ID exists when entered |
| **Insert Record** | Saves new project data to JsonPowerDB using the PUT command |
| **Retrieve Record** | Fetches and populates existing records using GET_BY_KEY |
| **Update Record** | Modifies existing records using the UPDATE command with rec_no |
| **Form Validation** | Validates all fields — empty checks, date format, deadline logic |
| **Smart Form States** | Enables/disables fields and buttons based on context |
| **Loading Indicator** | Visual overlay during database operations |
| **Error Handling** | Handles network errors, missing credentials, invalid responses |
| **Responsive Design** | Works on desktop, tablet, and mobile screens |
| **Secure Token** | JPDB token stored server-side, never in frontend code |
| **Duplicate Prevention** | Prevents accidental double-click submissions |

## Technologies Used

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript, jQuery 3.7.1, AJAX |
| **Backend** | Netlify Serverless Functions (Node.js) |
| **Database** | JsonPowerDB (REST API) |
| **Hosting** | Netlify |
| **Version Control** | Git & GitHub |

## About JsonPowerDB

**JsonPowerDB (JPDB)** is a real-time, high-performance, lightweight, and simple-to-use REST API-based multi-mode DBMS developed by Login2Xplore.

### Why JsonPowerDB for This Project?

- **Schema-free** — No need to define tables or columns upfront; JSON documents are stored as-is.
- **Serverless** — Accessible via REST API; no database server installation required on the application side.
- **Multi-mode** — Supports key-value, document, and RDBMS-like operations.
- **High Performance** — Built-in indexing provides very fast read/write operations.
- **Low Learning Curve** — Simple HTTP POST-based API makes it ideal for academic projects.
- **Real-time** — Changes are reflected immediately without complex replication or caching.

### JPDB API Commands Used in This Project

| Command | Endpoint | Purpose |
|---|---|---|
| `GET_BY_KEY` | `/api/irl` (IRL — Index Retrieval Language) | Retrieve a record by its indexed column value |
| `PUT` | `/api/iml` (IML — Index Manipulation Language) | Insert a new JSON document into a relation |
| `UPDATE` | `/api/iml` (IML — Index Manipulation Language) | Modify an existing record using its record number |

All JPDB API calls use **HTTPS POST** with a JSON body containing `token`, `cmd`, `dbName`, `rel`, and `jsonStr` fields.

## Database Structure

| Property | Value |
|---|---|
| **Database Name** | `COLLEGE-DB` |
| **Relation (Table)** | `PROJECT-TABLE` |
| **Primary Key** | `Project-ID` |

### Fields

| Column Name | Data Type | Description |
|---|---|---|
| `Project-ID` | String | Unique project identifier (primary key) |
| `Project-Name` | String | Name of the project |
| `Assigned-To` | String | Person assigned to the project |
| `Assignment-Date` | Date (YYYY-MM-DD) | Date the project was assigned |
| `Deadline` | Date (YYYY-MM-DD) | Project completion deadline |

## Application Workflow

```
Page Load
  └── Form initializes: only Project-ID is enabled
          │
          ▼
  User enters Project-ID → System checks database via GET_BY_KEY
          │
          ├── NOT FOUND → Enable all fields + Save button
          │                   └── User fills form → Save → PUT to JPDB
          │                                           └── Success → Reset form
          │
          └── FOUND → Populate fields from database + Enable Update button
                          └── User edits fields → Update → UPDATE to JPDB
                                                    └── Success → Reset form
```

## Project Folder Structure

```
PM-Dashboard/
│
├── index.html                    # Main HTML page with the form
├── css/
│   └── style.css                 # Complete stylesheet with responsive design
│
├── js/
│   └── script.js                 # Form behavior, validation, AJAX calls
│
├── netlify/
│   └── functions/
│       └── jpdb.mjs              # Secure serverless proxy to JsonPowerDB
│
├── .env.example                  # Template for environment variables
├── .gitignore                    # Protects credentials and generated files
├── netlify.toml                  # Netlify deployment configuration
├── package.json                  # Project metadata and dev dependencies
└── README.md                     # This documentation file
```

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Git](https://git-scm.com/)
- A [JsonPowerDB](http://api.login2explore.com:5577/) account (free)
- A [Netlify](https://www.netlify.com/) account (free tier)
- A [GitHub](https://github.com/) account

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/parimeena404/PM-Dashboard.git
   cd PM-Dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Open `.env` and replace `your-jpdb-connection-token-here` with your actual JPDB connection token.

## Database Configuration

Before using the application, set up JsonPowerDB:

1. **Open the JPDB Dashboard**
   - Go to [http://api.login2explore.com:5577](http://api.login2explore.com:5577)
   - Register a new account or log in.

2. **Get Your Connection Token**
   - Navigate to **Tools → Tokens → Connection Token**.
   - Click **Generate** if you don't have one.
   - **Copy** the token — you will need it for both local `.env` and Netlify configuration.

3. **Create the Database and Relation**
   - JsonPowerDB **automatically creates** the database (`COLLEGE-DB`) and relation (`PROJECT-TABLE`) when the first record is inserted using the PUT command.
   - **No manual table creation is required.**
   - The `Project-ID` field is automatically indexed when data is first inserted.

> **Verification:** After inserting the first record, navigate to the **Visualize** tab in the JPDB dashboard and confirm that `COLLEGE-DB` → `PROJECT-TABLE` exists with your data.

## Running Locally

### Using Netlify Dev (Recommended)

[Netlify Dev](https://www.netlify.com/products/dev/) emulates the serverless function locally:

```bash
npx netlify dev
```

This starts a local server (usually at `http://localhost:8888`) that serves both the static frontend and the serverless function.

### What to Expect

- The form loads at `http://localhost:8888`
- API requests go to `http://localhost:8888/.netlify/functions/jpdb`
- The serverless function reads `JPDB_TOKEN` from your local `.env` file
- All database operations work against the live JsonPowerDB instance

## Deployment on Netlify

### Step 1: Ensure Code Is on GitHub

This repository is already hosted at:
```
https://github.com/parimeena404/PM-Dashboard.git
```

### Step 2: Create a Netlify Site

1. Go to [https://app.netlify.com](https://app.netlify.com) and sign up / log in.
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** and authorize Netlify to access your repositories.
4. Choose the **PM-Dashboard** repository.

### Step 3: Configure Build Settings

| Setting | Value |
|---|---|
| **Branch to deploy** | `main` |
| **Build command** | *(leave empty)* |
| **Publish directory** | `.` |
| **Functions directory** | `netlify/functions` |

> The `netlify.toml` file in the repository configures these settings automatically.

### Step 4: Set the Environment Variable

1. In Netlify, go to **Site configuration** → **Environment variables**.
2. Click **Add a variable**.
3. Set:
   - **Key:** `JPDB_TOKEN`
   - **Value:** *(paste your JsonPowerDB connection token)*
4. Click **Save**.

### Step 5: Deploy

- Click **"Deploy site"**.
- Netlify will build and deploy automatically.
- Your site will be available at a URL like `https://your-site-name.netlify.app`.

### Step 6: Redeploy After Changes

- **Automatic:** Push changes to GitHub → Netlify deploys automatically.
- **Manual:** Go to **Deploys** → **Trigger deploy** → **Deploy site**.

## Testing Instructions

### Frontend Tests (No Database Required)

| # | Test | Expected Result |
|---|---|---|
| 1 | Page loads | Only Project-ID is enabled; Save & Update are disabled |
| 2 | Click Reset | All fields cleared; Project-ID enabled; cursor in Project-ID |
| 3 | Leave Project-ID empty, tab out | Warning: "Please enter a Project-ID" |
| 4 | Fill all fields except Deadline, click Save | Error: "Deadline is required" |
| 5 | Set Deadline before Assignment-Date, click Save | Error: "Deadline cannot be earlier than Assignment-Date" |
| 6 | Rapid double-click Save | Only one request fires (duplicate prevention) |

### Database Integration Tests (Requires JPDB Token)

| # | Test | Expected Result |
|---|---|---|
| 1 | Enter a new Project-ID, tab out | Fields enable; Save enabled; "New Project-ID" message |
| 2 | Fill all fields, click Save | Success message; form resets |
| 3 | Enter the same Project-ID again | Existing data populates; Update enabled; Save disabled |
| 4 | Modify a field, click Update | Success message; form resets |
| 5 | Re-enter the same Project-ID | Updated data appears correctly |
| 6 | Disconnect network, enter a Project-ID | Error message about network failure |

## Screenshots

> **Note:** Replace these placeholders with actual screenshots after deploying.

| Screen | Description |
|---|---|
| *Initial State* | Form on initial page load — only Project-ID enabled |
| *New Record* | Form ready for new entry after entering unused Project-ID |
| *Record Found* | Existing record populated after entering known Project-ID |
| *Save Success* | Success notification after saving a new record |
| *Validation Error* | Error notification for invalid input |

## Project Status

✅ **Complete** — The application is fully functional and ready for deployment.

### Implemented

- [x] HTML form with all five required fields
- [x] CSS responsive design with professional styling
- [x] JavaScript form behavior and validation
- [x] Smart field enable/disable state management
- [x] jQuery AJAX communication with backend
- [x] Netlify serverless function (secure proxy)
- [x] JsonPowerDB GET_BY_KEY integration (retrieve)
- [x] JsonPowerDB PUT integration (insert)
- [x] JsonPowerDB UPDATE integration (modify)
- [x] Loading indicator overlay
- [x] Error handling for network and database failures
- [x] Duplicate submission prevention
- [x] `.gitignore` for credential security
- [x] `.env.example` for configuration guidance
- [x] `netlify.toml` for deployment
- [x] Comprehensive README documentation

### Manual Steps Required

- [ ] Configure `JPDB_TOKEN` in `.env` (local) and Netlify (production)
- [ ] Deploy on Netlify
- [ ] Add screenshots to README

## Author

**Parimeena**
- GitHub: [@parimeena404](https://github.com/parimeena404)
- College Micro Project — 2026
