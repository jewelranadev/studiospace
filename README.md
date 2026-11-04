# StudioSpace 🎬

**StudioSpace** is a creative studio rental and booking platform where creators can discover, explore, and book professional creative spaces. Studio owners can list their studios and manage incoming bookings.

## ✨ Features

### User Features

* User Registration and Login
* Browse and Explore Studios
* Search and Filter Studios
* View Studio Details
* Book Studios by Date and Time
* View and Manage Personal Bookings
* Cancel Bookings
* User Dashboard

### Studio Owner Features

* Add New Studio Listings
* View and Manage Own Studios
* Edit Studio Information
* Delete Studio Listings
* View Incoming Bookings
* Confirm Booking Requests
* Manage Studio Availability

### Additional Features

* Responsive Design
* Light and Dark Theme
* Protected Routes
* Booking Conflict Prevention
* Studio Ownership Authorization
* Loading and Error Handling
* Custom 404 Page

## 🛠️ Technologies Used

### Frontend

* Next.js (App Router)
* React
* JavaScript
* Tailwind CSS
* Lucide React
* Better Auth

### Backend

* Node.js
* Express.js
* MongoDB
* MongoDB Native Driver

### Deployment

* Vercel (Frontend)
* Backend Hosting Platform
* MongoDB Atlas (Database)

## 📁 Project Structure

```text
studiospace/
│
├── src/
│   └── app/
│       ├── components/
│       ├── about/
│       ├── studios/
│       ├── dashboard/
│       ├── my-bookings/
│       ├── my-listings/
│       ├── host-bookings/
│       ├── add-studio/
│       └── ...
│
├── server/
│   ├── config/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
├── public/
├── package.json
└── README.md
```

## 🚀 Getting Started

Follow these steps to run StudioSpace locally.

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB Atlas Account
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/jewelranadev/studiospace.git
```

```bash
cd studiospace
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure Frontend Environment Variables

Create a `.env.local` file in the project root.

Add the environment variables required by your frontend configuration.

Example:

```env
SERVER_API_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Install Backend Dependencies

```bash
cd server
npm install
```

### 5. Configure Backend Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
INTERNAL_API_KEY=your_internal_api_secret
```

Add any additional variables required by your backend and Better Auth configuration.

**Important:** Use the exact environment variable names from your existing code. Never upload `.env` or `.env.local` files containing real credentials to GitHub.

### 6. Start the Backend Server

From the `server` directory:

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

### 7. Start the Frontend Server

Open another terminal in the project root:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:3000
```

## 🔐 Security Features

* Authentication-based access control.
* Studio ownership verification for Edit and Delete operations.
* Booking ownership verification.
* Host authorization for booking confirmation.
* Server-side booking validation.
* Prevention of overlapping active bookings.
* Internal API request verification.

## 📅 Booking System

StudioSpace supports date-based and time-based studio reservations.

The booking system checks:

* Studio availability.
* Booking date and time validity.
* Existing booking conflicts.
* Cancelled booking status.
* Booking ownership.
* Host authorization.

## 🌐 Deployment

### Frontend

The Next.js application can be deployed using Vercel.

### Backend

The Express.js server needs to be deployed separately on a Node.js-compatible hosting platform.

### Database

MongoDB Atlas is used for cloud database hosting.

Make sure all production environment variables, API URLs, authentication URLs, trusted origins, and internal API secrets are configured correctly before deployment.

## 👨‍💻 Developer

**Jewel Rana**

* GitHub: [@jewelranadev](https://github.com/jewelranadev)

## 📄 License

This project is developed for educational and learning purposes.
