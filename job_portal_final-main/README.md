# Full-Stack Job Portal

A full-stack web-based Job Portal that connects students/job seekers with companies and provides administrators with tools to manage users, jobs, applications, and recruitment activities.

## 📌 Project Overview

The Full-Stack Job Portal is designed to simplify the recruitment process by providing separate interfaces for Students, Companies, and Administrators.

Students can create profiles, search and apply for jobs, upload resumes, and track applications and interviews.

Companies can register, manage their profiles, create job postings, and manage applications.

Administrators can manage and monitor the overall portal, including users, companies, jobs, applications, approvals, and reports.

## ✨ Features

### 👨‍🎓 Student Module

* Student registration and login
* Secure authentication
* Student dashboard
* Profile management
* Resume upload
* Profile picture upload
* Browse available jobs
* Search and filter jobs
* Apply for jobs
* View submitted applications
* View interview information
* Logout functionality

### 🏢 Company Module

* Company registration and login
* Company dashboard
* Company profile management
* Create and manage job postings
* View applications
* Manage recruitment activities

### 👨‍💼 Admin Module

* Admin login
* Admin dashboard
* Manage students
* Manage companies
* Verify and approve users
* Manage jobs
* View applications
* View recruitment results
* Generate reports

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Axios
* React Router
* Recharts

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcryptjs
* Nodemailer

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### Development Tools

* Visual Studio Code
* Git
* GitHub
* npm

## 📂 Project Structure

```text
Full-Stack-Job-Portal/
│
└── job_portal_final-main/
    │
    ├── frontend/
    │   ├── src/
    │   ├── public/
    │   ├── package.json
    │   └── .gitignore
    │
    ├── job-backend/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   ├── server.js
    │   ├── package.json
    │   └── .env
    │
    └── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/hemalathas838/Full-Stack-Job-Portal.git
```

### 2. Open the Project

```bash
cd Full-Stack-Job-Portal/job_portal_final-main
```

### 3. Install Backend Dependencies

```bash
cd job-backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `job-backend` folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

**Important:** Never upload the `.env` file containing real credentials to GitHub.

### 5. Start the Backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 7. Start the Frontend

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

## 🔐 Authentication

The application uses JWT-based authentication.

Passwords are securely hashed before being stored in the database using bcryptjs.

Different user roles provide access to their respective dashboards and features.

## 🗄️ Database

The application uses MongoDB Atlas as the cloud database.

Mongoose is used to define schemas and interact with MongoDB.

## 🔄 Application Flow

```text
Student / Company
       │
       ▼
   Registration
       │
       ▼
     Login
       │
       ▼
 Authentication
       │
       ▼
    Dashboard
       │
       ├── Profile
       ├── Jobs
       ├── Applications
       └── Interviews
```

## 🎯 Project Objectives

* Provide a centralized job-search platform
* Simplify student job applications
* Help companies manage job postings and applicants
* Provide administrators with centralized management
* Reduce manual recruitment processes
* Provide secure role-based access

## 🚀 Future Enhancements

* Email notifications for job applications
* Advanced job recommendation system
* Resume parsing
* Online aptitude tests
* Video interview integration
* Real-time notifications
* Advanced analytics and recruitment reports

## 👩‍💻 Project

**Full-Stack Job Portal**

Developed as an academic full-stack web development project.

## 📄 License

This project is developed for academic and educational purposes.

````

### Step 3 — Save it

Press:

**Ctrl + S**

Then in your terminal:

```powershell
git add README.md
````

```powershell
git commit -m "Improve project documentation"
```

```powershell
git push origin main
```

After pushing, refresh GitHub and the README should appear on the repository's main page.

[View your GitHub repository](https://github.com/hemalathas838/Full-Stack-Job-Portal?utm_source=chatgpt.com)

**Don't put your actual MongoDB URI, email password, or JWT secret in the README.** Keep those only in your local `.env`.
