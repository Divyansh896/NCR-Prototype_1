# NCR Tracking System – Stellar Co.

A custom-built web application designed for manufacturers to manage Non-Conformance Reports (NCRs) for defective products—streamlining quality-assurance workflows across QA, Engineering, and Purchasing teams.

---

## 👥 About Stellar Co.
**Stellar Co.** is a student-led development team formed at **Niagara College** in late 2024. Our capstone projects pair us with real-world organizations to solve genuine business problems. For this engagement, we partnered with a mid-sized manufacturing firm to replace spreadsheets and email chains with a unified **NCR Tracking System**.

The application mirrors the clean architecture, documentation style, and agile approach we used for the **NIA CRM** project while targeting a different domain—quality management instead of membership relations.

> This repo reflects our commitment to secure code, intuitive UX, and robust back-end design. We’re proud to showcase it alongside the NIA CRM as proof of our versatility.

---

## 🤝 Collaborators
- [Divyansh](https://github.com/Divyansh896)
- [Elizaveta Lazareva](https://github.com/Eliza707707)
- [Rohit Thakur](https://github.com/rohitthaku-rt)


---

## 📌 Table of Contents
1. [Introduction](#-introduction)  
2. [Project Overview](#-project-overview)  
3. [Key Features](#-key-features)  
4. [Technical Stack](#-technical-stack)  
5. [Functional Modules](#-functional-modules)  
6. [Security & Compliance](#-security--compliance)  
7. [Performance Requirements](#-performance-requirements)  
8. [Interface Requirements](#-interface-requirements)  
9. [Other Non-functional Attributes](#-other-non-functional-attributes)  
10. [Hosted Link & Login Info](#-hosted-link--login-info)  

---

## 🧩 Introduction
The **NCR Tracking System** is a responsive web app that centralizes all defect reports in one place, ensuring traceability, accountability, and faster resolution. The system went from concept to deployment between **September – December 2024**.

---

## 📊 Project Overview
### 🎯 Objective
Eliminate email-driven NCRs by giving QA, Engineers, and Purchasing a single workflow with status tracking, attachments, and analytics.

### ⏳ Timeline
September 2024 – December 2024  
(Requirements → Design → Development → Testing → Deployment)

### 👥 Team Members
See the [Collaborators](#-collaborators) list.

---

## 🛠 Key Features
| Feature                 | Description                                                         |
|-------------------------|---------------------------------------------------------------------|
| **Role-Based Access**   | Separate permissions for QA, Engineers, Purchasing, Admin               |
| **Dynamic Dashboards**  | At-a-glance counts for Open, In Progress, Resolved, Closed         |
| **Full NCR Lifecycle**  | Create, assign, comment, attach evidence, change status            |
| **Search & Filters**    | Product ID, Defect Type, Severity, Date, Status                    |
| **Analytics Reports**   | Export PDF/CSV; charts for recurring defects & lead time           |
| **Mobile-First UI**     | TailwindCSS for responsive screens                                 |

---

## ⚙️ Technical Stack

| Layer        | Technologies & Tools                              |
|--------------|---------------------------------------------------|
| **Markup**   | HTML5                                             |
| **Styling**  | CSS3 (Flexbox, Grid, media queries)               |
| **Logic**    | Vanilla JavaScript (ES6+)                         |
| **Data**     | `fetch()` API → loads seed data from `ncr_reports.json` and updates state in `localStorage` |

*The app uses the browser’s native **Fetch API** to read a local JSON file as initial seed data, giving realistic CRUD-style interaction while remaining 100 % front-end.*

---

## 🧩 Functional Modules
1. **User & Role Management** – Admins manage users/roles.  
2. **NCR Creation** – QA logs product defects with photos/docs.  
3. **Investigation Workflow** – Engineers add root-cause analysis & corrective actions.  
4. **Purchasing Actions** – Generate POs/material requisitions before closure.  
5. **Reporting Dashboard** – Visualize realtime graphs and export reports.  
6. **Audit Trail** – Immutable log of every status change & comment.

---

## 🔧 Other Non-functional Attributes
Security | Reliability | Maintainability | Portability | Extensibility

---

## 🌐 Hosted Link & Login Info
**URL**: *Coming soon*  

### Test Users
| Username               | Password | Role       |
|---------------------|----------|------------|
| jsmith         | jsmithqa | QA         |
| dhenry        | dhenryer | Engineer   |
| bmiller | bmilleroc | Purchasing |
| gwhite | gwhitead | Admin |

---

📄 **User Manual PDF**: _Coming soon_

> Developed by **Stellar Co.** 🚀
