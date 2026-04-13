# We're Human 🩵

> **Technology designed for empathy.** > A centralized, real-time platform bridging the gap between Non-Governmental Organizations (NGOs) and passionate volunteers to streamline community initiatives and urgent blood donation requests.

## Overview

In a world moving faster than ever, the desire to help often gets lost in the noise of *how* to help. **We're Human** was built to eliminate the friction between a good intention and a real-world impact. 

Whether it is an urgent call for life-saving blood or a weekend beach cleanup, this platform equips NGOs with the tools they need to mobilize volunteers instantly, while giving citizens a beautifully simple, modern interface to discover where their help is needed most.

## Key Features

* **Role-Based Architecture:** Distinct workflows for `ngo_admin` (event creators) and `volunteer` (participants) secured via JSON Web Tokens (JWT).
* **Urgent Blood Request Network:** A dedicated system for broadcasting critical, time-sensitive blood requirements to local communities.
* **Live Community Feed:** An infinite-scrolling timeline of local initiatives and requests.
* **Real-Time Communications:** A fully integrated, split-pane chat interface using **Socket.io** for live coordination between NGOs and registered volunteers.
* **Automated Event Reminders:** Background cron jobs (`node-cron`) that automatically email volunteers 24 hours before their committed events using `nodemailer`.
* **Smart Dashboard & CRUD:** Full lifecycle management of events. NGOs can create, edit, and delete initiatives, while volunteers can track their history and manage enrollments.
* **Modern UI/UX:** A responsive, accessible, "glass-morphic" design built with Tailwind CSS and React.

## 🛠️ Tech Stack

**Frontend (Client)**
* **Core:** React 18, Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM v6
* **Icons:** Lucide React
* **Network & Real-Time:** Axios, Socket.io-client

**Backend (Server)**
* **Core:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ORM
* **Authentication:** bcryptjs, jsonwebtoken (JWT)
* **Real-Time:** Socket.io
* **Automation:** node-cron, nodemailer

## 🚀 Getting Started

Follow these instructions to run the "We're Human" platform locally on your machine.

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Local instance or MongoDB Atlas cluster)
* A Gmail account with "App Passwords" enabled (for automated emails)

### 1. Clone the Repository
```bash
git clone [https://github.com/Dishant0123/we-re-human-webapp.git](https://github.com/Dishant0123/we-re-human-webapp.git)
