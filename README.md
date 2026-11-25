# Fluentia Academy — Languages Academy Management System (LAMS)

> A full-stack, role-based web application that centralises scheduling, registration, payments, grades, attendance and parent communication for a languages-teaching institution.

![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-utility--first-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)
![UML](https://img.shields.io/badge/Modelled_with-UML-blue)
![Status](https://img.shields.io/badge/status-academic_project-4318FF)

*Fluentia* comes from the Latin word for fluency and flow: the goal is for every administrative process in the academy to run as smoothly as a fluent conversation.

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Key Features](#key-features)
3. [User Roles](#user-roles)
4. [Screenshots](#screenshots)
5. [Tech Stack](#tech-stack)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)
8. [Database Overview](#database-overview)
9. [Authentication and Routing](#authentication-and-routing)
10. [Available Scripts](#available-scripts)
11. [Design and Modelling](#design-and-modelling)
12. [Roadmap](#roadmap)
13. [Team](#team)
14. [Acknowledgements](#acknowledgements)

---

## About the Project

Languages academies have a complicated organisational profile. Students must be assessed before enrolment, grouped by proficiency level, assigned to available teachers and rooms without schedule clashes, and then followed academically and financially for the whole course.

Paper files and spreadsheets cause errors, slow down communication and waste staff time. Generic school-management suites cover only part of the need: none of them handles level-based groups, a placement-test enrolment path, PDF receipts tied to a student ledger, or a parent dashboard for several children.

**LAMS** is built to close those gaps. It gives each type of user an interface limited to the data and actions relevant to their job.

This repository is the delivery artefact of a Bachelor's thesis (University of Jijel, Department of Computer Science, academic year 2025–2026).

---

## Key Features

| Area | What it does |
| --- | --- |
| **Scheduling** | Create study groups and timetables with real-time teacher and room conflict detection. |
| **Registration** | Two enrolment paths: direct course enrolment or placement test. The student joins from the public Join page, and staff can register manually. |
| **Payments** | Record tuition payments, track balances, filter history, and generate PDF receipts. |
| **Grades** | Teachers enter final grades (0 to 20) and validate level advancement. |
| **Attendance** | Group-level attendance per session, absence history, and absence justifications submitted by students. |
| **Parent dashboard** | One account to follow several enrolled children (family mode). |
| **Documents** | Generate, preview, print and export academic and administrative documents (certificates, receipts and more). |
| **Communication** | Targeted messages, school-wide announcements and notifications for students, parents, teachers and staff. |
| **Recruitment** | Public "Join our faculty" form with CV upload; administrators review and accept or reject applications. |
| **Branding** | School name, logo, stamp and contact details are edited once in Settings and appear across all dashboards. |

---

## User Roles

The platform has five actor categories with strict role-based access control.

| Role | Main responsibilities |
| --- | --- |
| **Administrator** | Global oversight, staff and payroll, teacher applications, reports, school profile, user deletion. Inherits all Secretary capabilities. |
| **Secretary** | Student registration, payments, groups and timetables, documents, exams, absence justifications, announcements. |
| **Teacher** | Attendance, grade entry and level validation, course material upload. |
| **Student** | Dashboard (schedule, grades, balance), PDF receipts, course materials, absence justifications. |
| **Parent** | Monitor one or more children, message the administration, receive attendance notifications. |

---

## Screenshots

> Add your screenshots to `docs/screenshots/` and keep the file names below, or update the paths.

| Login | Admin dashboard |
| --- | --- |
| ![Login](docs/screenshots/login.png) | ![Admin dashboard](docs/screenshots/admin-dashboard.png) |

| Secretary dashboard | Teacher dashboard |
| --- | --- |
| ![Secretary dashboard](docs/screenshots/secretary-dashboard.png) | ![Teacher dashboard](docs/screenshots/teacher-dashboard.png) |

| Student dashboard | Document center |
| --- | --- |
| ![Student dashboard](docs/screenshots/student-dashboard.png) | ![Document center](docs/screenshots/document-center.png) |

---

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Front end | **React** (built with **Vite**) | Single-page application, one module per role |
| Styling | **Tailwind CSS** and inline design tokens | Responsive layouts and a consistent design system |
| Routing | **React Router** | Role-based navigation between dashboards |
| Database and auth | **Supabase** (PostgreSQL) | Tables, authentication, Row-Level Security, file storage, backups |
| Email | **EmailJS** | Credentials, attendance and payment notifications |
| Local backend | **Docker** | Optional local Supabase instance for development |
| Design | **Figma** | High-fidelity mockups for every role |
| Modelling | **Visual Paradigm** | Use case, sequence and class diagrams |
| Versioning | **Git** and **GitHub** | Branching, pull requests, issues, Kanban board |

---

## Project Structure

```text
src/
├── App.jsx                     # Home page and all routes
├── App.css
├── supabaseClient.js           # Supabase client (reads environment variables)
├── assets/                     # Hero image and course pictures
└── components/
    ├── login.jsx               # Common sign-in page
    ├── join.jsx                # Public enrolment request form
    ├── admin/
    │   └── dashboardA.jsx      # Administrator dashboard
    ├── secretery/
    │   ├── dashboard.jsx       # Secretary dashboard
    │   ├── Enrollment.jsx
    │   ├── SchoolSchedule.jsx
    │   ├── Appointments.jsx
    │   ├── SchedulingHub.jsx
    │   ├── StudentsManagement.jsx
    │   ├── AttendanceRecords.jsx
    │   ├── ParentPortal.jsx    # Communication portal
    │   ├── Documents.jsx
    │   ├── exams.jsx
    │   ├── payment.jsx
    │   └── Topbar.jsx
    ├── teacher/
    │   └── Dashboardt.jsx      # Teacher dashboard
    └── student-parent/
        └── StudentDashboard.jsx
```

> The folder is spelled `secretery` in the codebase. Rename it only if you update every import.

---

## Getting Started

### Prerequisites

You need these installed before you begin:

- **Node.js** version 18 or newer ([download](https://nodejs.org)). Check with `node -v`.
- **npm**, which comes with Node.js. Check with `npm -v`.
- **Git** ([download](https://git-scm.com)). Check with `git --version`.
- A free **Supabase** project ([supabase.com](https://supabase.com)).

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repository>.git
cd <your-repository>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a file named `.env` in the project root (next to `package.json`):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

You can find both values in your Supabase dashboard under **Project Settings → API**.

> Make sure the variable names match what `src/supabaseClient.js` reads.
> Never commit `.env` to GitHub and never expose the `service_role` key in the front end.

### 4. Prepare the database

Create the tables listed in [Database Overview](#database-overview) in your Supabase project, and create a public storage bucket named `documents` (used for CVs and course files). Then insert one row with `id = 1` in `school_settings`. That row stores the school name, logo and contact details used across the app.

### 5. Run the app

```bash
npm run dev
```

Open the address printed in the terminal (usually `http://localhost:5173`).

### 6. Create your first account

1. In Supabase, go to **Authentication → Users** and add a user (email and password).
2. In the `staff` table, add a row with the **same email** and `role` set to `admin`.
3. Sign in on `/login`. You will be redirected to the administrator dashboard.

### Optional: run Supabase locally with Docker

If you prefer not to use the cloud during development, install [Docker](https://www.docker.com) and follow the Supabase self-hosting guide to start a local instance, then point `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to it.

---

## Database Overview

The tables below are the ones used by the application code. The complete relational model is documented in the thesis.

| Table | Purpose |
| --- | --- |
| `staff` | Administrators, secretaries and teachers. The `role` column drives login redirection. |
| `students` | Students and parent accounts. Holds level, language, group, exam type (`Placement` or direct) and parent contact fields. |
| `school_settings` | Single row (`id = 1`) with school name, logo, stamp, phone, email, website, address and social links. |
| `communications` | Messages, announcements and notifications between roles. |
| `teacher_requests` | Applications sent from the public "Join our faculty" form, with a CV link. |
| `document_logs` | Audit trail of generated documents (type, person, generator, timestamp). |

Security is enforced at two levels: role-based redirection in the application, and **Row-Level Security** policies in Supabase so that each role can only read and write its own data.

---

## Authentication and Routing

Every user signs in through the same page. After a successful login the application looks the user up by email and redirects according to the role.

| Condition | Destination |
| --- | --- |
| Found in `staff` with role `admin` | `/admin/dashboard` |
| Found in `staff` with role `secretary` | `/secretary/dashboard` |
| Found in `staff` with role `teacher` | `/teacher/dashboard` |
| Found in `students` | `/student-parent` |
| Student whose exam type is still `Placement` | Access refused until the placement exam is completed |
| Email in neither table | Signed out with an explanatory message |

Public routes: `/` (home page), `/login` and `/join`.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimised production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on the project |

---

## Design and Modelling

The system was modelled before it was coded.

- **4 use case diagrams**: Administrator, Secretary, Teacher, Student
- **12 sequence diagrams**: authentication, grade entry, attendance, course access, grade consultation, absence justification, teacher application processing, payroll, group creation, online requests and payments
- **1 global class diagram** and the **relational model**
- **High-fidelity Figma mockups** for every role

Development followed **Agile** with two-week sprints, a `main` branch for stable releases, a `develop` branch for integration, and feature branches such as `feature/payment-module`.

### Design system

The interface uses one consistent visual language across all dashboards: a deep navy sidebar (`#0f172a`), a purple accent (`#4318FF`), rounded cards, SVG icons, and visible focus states on every control.

---

## Roadmap

- [ ] Mobile companion app (React Native) with push notifications
- [ ] Public online enrolment portal with online payment
- [ ] Adaptive in-browser placement test
- [ ] Business-intelligence dashboard (retention, revenue, teacher performance)
- [ ] Multi-branch support under one administrator account
- [ ] Integration with a learning platform such as Moodle

---

## Team

| Name | Role |
| --- | --- |
| **Marwa Hammoudi** | Developer |
| **Selma Harboula** | Developer |
| **Malak Kehal** | Developer |

**Supervisor:** Dr. El Hillali Kerkouche
Department of Computer Science, Faculty of Exact Sciences and Computer Science, University of Jijel, Algeria.

---

## Acknowledgements

- The administrative staff, teachers and secretaries of the local languages academy who took part in the observation sessions and interviews.
- The open-source communities behind React, Vite, Tailwind CSS and Supabase.

---

<p align="center">Bachelor's thesis project · University of Jijel · 2025–2026</p>