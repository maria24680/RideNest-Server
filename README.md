## 📌 Project Name
RideNest - Car Rental Platform Backend

---

## 🎯 Purpose
RideNest is a full-stack car rental platform built using the MERN stack (MongoDB, Express.js, Node.js, React).

This backend server handles:
- Secure authentication using JWT
- Car listing CRUD operations
- Booking management system
- User-specific data filtering
- Protected REST API endpoints

Users can explore available cars, add their own cars, update listings, delete cars, and book vehicles securely.

---

## 🌐 Live Server URL
https://ride-nest-server.vercel.app/

---

## ⚙️ Tech Stack
- Node.js  
- Express.js  
- MongoDB  
- JWT Authentication (jose-cjs)  
- CORS  
- Dotenv  

---

## 📦 NPM Packages Used
- express  
- mongodb  
- cors  
- dotenv  
- jose-cjs  
- nodemon (dev dependency)  

---

## 🔐 Authentication System
RideNest uses **JWT-based authentication with Bearer token protection**.

### Features:
- User login via frontend authentication system  
- JWT token verification using middleware  
- Protected API routes  
- Secure access using Authorization header  
- Forbidden access blocking for invalid tokens  

---

## 🧩 Main Features (Backend)

### 👤 Authentication
- JWT token verification middleware  
- Protected routes using `verify` middleware  

---

### 🚗 Car Management
- Add new car (Authenticated users only)  
- Get all cars (Public + filter by email/search/type)  
- Get single car by ID (Protected)  
- Update car details (Owner only, protected)  
- Delete car listing (Owner only, protected)  

---

### 📅 Booking System
- Create booking (Authenticated users only)  
- Get user-specific bookings  
- Delete booking  
- Automatically increase booking count using `$inc`  

---

### 🔎 Search & Filter
- Search cars by name using `$regex`  
- Filter cars by type using `$in`   

---

## 🗄️ Database Structure

### 🚗 Cars Collection
```js
{
  name: String,
  pricePerDay: Number,
  type: String,
  image: String,
  seats: Number,
  location: String,
  description: String,
  availability: Boolean,
  userEmail: String,
  booking_count: Number
}