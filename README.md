# Project Management Form using JsonPowerDB

**Live Deployed Application:** [https://pm-dashboard.netlify.app](https://pm-dashboard.netlify.app)  
**GitHub Repository:** [https://github.com/parimeena404/PM-Dashboard](https://github.com/parimeena404/PM-Dashboard)

---

## 1. Description

The Project Management Form is a web-based micro project developed using JsonPowerDB. The application is designed to store, retrieve and update project-related information in a database.

The project uses Project-ID as its primary key to uniquely identify each project.

The application allows users to:
- Enter new project details.
- Check whether a Project-ID already exists.
- Retrieve existing project information.
- Update the details of an existing project.
- Reset the form to its initial state.
- Validate input fields to prevent empty data.

### Database Details

| Property | Value |
|---|---|
| Database Name | COLLEGE-DB |
| Relation Name | PROJECT-TABLE |
| Primary Key | Project-ID |

### Input Fields

1. Project-ID
2. Project-Name
3. Assigned-To
4. Assignment-Date
5. Deadline

---

## 2. Benefits of Using JsonPowerDB

JsonPowerDB offers several benefits:

1. **Simple to Use:** Provides a straightforward way to store and retrieve JSON data.
2. **Schema-Free:** Offers flexibility when working with JSON-based records.
3. **REST API Support:** Allows applications to communicate with the database using API requests.
4. **Fast Development:** Reduces the complexity involved in building database-driven applications.
5. **JSON-Based:** Works naturally with JavaScript applications and JSON data.
6. **Easy Integration:** Can be integrated with web applications using JavaScript and AJAX.
7. **Lightweight:** Makes it convenient to develop small database-driven applications.

---

## 3. Scope of Functionalities

The project provides the following functionalities:

- Primary-key-based record checking.
- New project insertion.
- Existing project retrieval.
- Project information updating.
- Form reset functionality.
- Input validation.
- Database connectivity using JsonPowerDB.

---

## 4. Technologies Used

- NetBeans IDE / Modern Code Editor
- JsonPowerDB (REST API)
- HTML5
- CSS3
- JavaScript
- jQuery / AJAX
- Netlify Serverless Functions (Secure API proxy for connection token)
- Netlify (Hosting & Deployment)

---

## 5. Database Structure

**Database:** COLLEGE-DB  
**Relation:** PROJECT-TABLE  
**Primary Key:** Project-ID

| Field Name | Description |
|---|---|
| Project-ID | Unique project identifier |
| Project-Name | Name of the project |
| Assigned-To | Person assigned to the project |
| Assignment-Date | Date of assignment |
| Deadline | Project completion deadline |

---

## 6. How to Use

1. Open the application: [https://pm-dashboard.netlify.app](https://pm-dashboard.netlify.app)
2. Enter a **Project-ID** and press Enter or Tab.
3. **If the ID is new:** The form unlocks all fields. Enter the project details and click **Save**.
4. **If the ID already exists:** The existing information will be retrieved and displayed automatically.
5. Modify the required fields and click **Update**.
6. Click **Reset** to clear the form and return to the initial state.

---

## 7. Release History

### Version 1.0.0 – Initial Release
**Date:** 15 November 2026

- Created the Project Management Form.
- Integrated the application with JsonPowerDB REST API.
- Implemented primary key checking (`GET_BY_KEY`).
- Added project record insertion (`PUT`).
- Added project record updating (`UPDATE`).
- Implemented form reset and input validation.
- Implemented secure serverless backend proxy to protect connection token.
- Deployed live on Netlify.

---

## 8. Project Status

Initial micro project release for academic learning and demonstration of JsonPowerDB database operations.

---

## 9. Author

Developed as part of the JsonPowerDB Micro Project assignment.
