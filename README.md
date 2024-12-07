# NCR Tracking System

## Overview
The NCR Tracking System is a web-based platform designed to streamline the management and tracking of defective products through Non-Conformance Reports (NCRs). This system enables collaboration between the Quality Assurance (QA) team, engineers, and the purchasing department to track, resolve, and document defective product issues efficiently.

## Features
### 1. **User Authentication & Roles**
- Role-based access for QA personnel, engineers, and purchasing department members.
- Secure login system with role-specific permissions.

### 2. **Dashboard**
- Personalized dashboards for QA personnel, engineers, and the purchasing department, displaying NCR statuses (e.g., Open, In Progress, Resolved, Closed).
- Overview of ongoing and past NCRs.

### 3. **Creating an NCR Report (QA Personnel)**
- QA personnel can create a new NCR by entering product details, defect descriptions, and attaching supporting documents.
- Fields include:
  - Product ID, Description
  - Defect Type (e.g., Packaging, Functional, Material)
  - Severity (e.g., Critical, Major, Minor)
  - Photos or documents
- The report is submitted to the engineer for further investigation.

### 4. **Reviewing and Updating NCR Reports (Engineers)**
- Engineers can review assigned NCRs, investigate the defects, and propose corrective actions.
- Ability to add comments and attach files to support investigations.
- Update NCR status to "In Progress" or "Resolved."

### 5. **Purchasing Department Actions**
- After an NCR is marked "Resolved" by the engineer, it is forwarded to the purchasing department.
- The purchasing team can review the NCR, create material requisitions, and update the status to "Closed" when actions are completed.

### 6. **Reporting & Analytics**
- Generate reports on NCR statuses, defect types, and performance metrics.
- Analytics tools track recurring defects, resolution times, and departmental performance.

### 7. **Notifications & Alerts**
- Email and in-app notifications for status updates, new NCRs, and required actions.
- Real-time alerts to ensure timely responses.

### 8. **Search & Filter Functionality**
- Search NCRs by filters like Product ID, Date of Discovery, Defect Type, and Status.
- Quick access to relevant NCR information.

### 9. **Audit Trail & History**
- Maintain a detailed log of all actions taken on each NCR, including status changes, user actions, and comments.

### 10. **Mobile-Friendly Design**
- A responsive design ensuring access on desktops, tablets, and smartphones.

## User Flow

1. **QA Personnel**
   - Log in, create a new NCR, and submit it for review by the engineer.

2. **Engineer**
   - Log in, review assigned NCRs, investigate defects, propose solutions, and forward to the purchasing department if parts are needed.

3. **Purchasing Department**
   - Log in, review the resolved NCR, create material requisitions, and mark the NCR as "Closed" when the issue is addressed.

## Technical Requirements
- **Backend**: A database (e.g., MySQL, PostgreSQL) to store NCRs, user data, and attachments.
- **Frontend**: React or Angular for dynamic and interactive user interfaces.
- **Security**: SSL encryption, role-based authentication, and data access control.
- **API Integration**: Future scalability with ERP systems and email services for notifications.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Divyansh896/NCR-Prototype_1.git
