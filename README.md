# Project Management Form using JsonPowerDB

A lightweight web application for managing project records using **JsonPowerDB**. The application allows users to create, retrieve, and update project information through a simple form-based interface.

The project demonstrates how a web application can communicate with a NoSQL database using REST APIs and perform database operations without requiring a complex backend architecture.

---

## 1. Project Overview

The Project Management Form is a college micro project developed to demonstrate database connectivity and record management using JsonPowerDB.

It provides a structured form where users can enter a unique Project ID, check whether a record already exists, and perform the appropriate database operation.

If the entered Project ID is new, the application allows the user to create a project record. If the ID already exists, the application retrieves the saved information and allows the user to update it.

The application follows a simple and controlled workflow to ensure that project records are managed correctly.

---

## 2. Project Objectives

The main objectives of this project are:

- To understand the working of JsonPowerDB.
- To establish communication between a web application and a database.
- To implement record insertion, retrieval, and updating.
- To understand the role of a primary key in database management.
- To implement form validation and input handling.
- To develop a responsive and user-friendly interface.
- To understand REST API communication and asynchronous requests.

---

## 3. Features

- **Primary Key Validation:** Checks whether a Project ID already exists in the database.
- **New Record Creation:** Allows users to enter and save new project details.
- **Existing Record Retrieval:** Automatically fetches project information using the Project ID.
- **Record Updating:** Allows users to modify previously saved project details.
- **Form Reset:** Clears the form and restores its initial state.
- **Input Validation:** Prevents empty fields and invalid date entries.
- **Date Validation:** Ensures the project deadline is not earlier than the assignment date.
- **Dynamic Form Controls:** Enables and disables fields and buttons according to the current operation.
- **Responsive Interface:** Provides a clean layout across different screen sizes.
- **Database Integration:** Stores and retrieves records through JsonPowerDB.

---

## 4. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure of the application |
| CSS3 | Styling and responsive design |
| JavaScript | Application logic and form interactions |
| jQuery | DOM manipulation and event handling |
| AJAX | Asynchronous communication |
| JsonPowerDB | Database storage and retrieval |
| Netlify | Website hosting and serverless functions proxy |

---

## 5. Database Configuration

**Database Name:** `COLLEGE-DB`  
**Relation Name:** `PROJECT-TABLE`  
**Primary Key:** `Project-ID`

### Data Fields

| Field Name | Type | Description |
|---|---|---|
| `Project-ID` | String | Unique project identifier (Primary Key) |
| `Project-Name` | String | Name of the project |
| `Assigned-To` | String | Person assigned to the project |
| `Assignment-Date` | Date (YYYY-MM-DD) | Date the project was assigned |
| `Deadline` | Date (YYYY-MM-DD) | Project completion deadline |

---

## 6. How to Use

1. Open the application: [https://projm-dashboard.netlify.app](https://projm-dashboard.netlify.app)
2. Enter a **Project-ID** (e.g., `PRJ-101`) and press **Tab** or **Enter**.
3. **If the ID is new:** The form unlocks all fields. Fill in the details and click **Save**.
4. **If the ID already exists:** The existing project details will be populated automatically. Edit any field and click **Update**.
5. Click **Reset** at any time to clear the form and return to the initial state.
