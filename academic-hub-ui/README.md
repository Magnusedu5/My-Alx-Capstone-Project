# Document Management System (Frontend)

This is the **frontend for the Document Management System (DMS)** — an academic document and results management platform used by **staff** and **HODs**.

The backend is already completed using **Django + DRF**, and this frontend will interact with it through REST API endpoints.

---

## 🎯 Project Goal

Build a **simple, clean MVP** that allows:

### **Staff**

* Login
* Upload results
* Upload documents
* View all uploaded items

### **HOD**

* Login
* View all documents/results
* Approve or reject documents/results

You only need to build the **UI + API connections**. No advanced features required for now.

---

## 🔗 Backend API Base URL

(Replace with the final deployed backend URL)

```
https://my-alx-capstone-project.onrender.com
```

---

## 📌 Important API Endpoints (Frontend will consume these)

### **Authentication**

```
POST /api/login/
```

### **Results**

```
GET /api/results/               → list results
POST /api/results/upload/       → upload result
GET /api/results/filter/        → filter by session/semester/course
```

### **Documents**

```
GET /api/documents/             → list documents
POST /api/documents/upload/     → upload document
```

### **Dashboard (role-based)**

```
GET /api/dashboard/
```

The backend uses **Django session authentication** or **token authentication** (depending on configuration), so store the returned auth token or session cookie and include it in all requests.

---

## 🛠 Tech Stack (Frontend Expected)

You are free to choose one:

### Option A — **Vite + React (recommended)**

Fast, clean, simple for MVP.

### Option B — **Plain JavaScript + HTML + CSS**

If keeping the original frontend structure.

---

## 📁 Suggested Project Structure (React)

```
frontend/
│── src/
│    ├── components/
│    ├── pages/
│    ├── api/
│    │    └── backend.js   (axios instance)
│    ├── App.jsx
│    └── main.jsx
│── public/
│── package.json
│── vite.config.js
```

---

## 🚀 Setup Instructions

### 1. Install dependencies

```
yarn install
```

### 2. Run development server

```
yarn dev
```

### 3. Build for production

```
yarn build
```

### 4. Preview production build

```
yarn preview
```

---

## 🔌 API Setup (Axios Example)

Create:
`src/api/backend.js`

```js
import axios from "axios";

const api = axios.create({
  baseURL: "https://my-alx-capstone-project.onrender.com",
  withCredentials: true,
});

export default api;
```

Use:

```js
const response = await api.post("/api/login/", {
  username,
  password,
});
```

---

## 🧪 Minimum Pages Required for MVP

### 1. **Login Page**

* Username + password
* Submit → redirect based on role

### 2. **Dashboard**

* Show basic stats from `/api/dashboard/`

### 3. **Upload Result Page**

* File upload
* Course code, session, semester
* Submit to `/api/results/upload/`

### 4. **Upload Document Page**

* File + title
* Submit to `/api/documents/upload/`

### 5. **Results List Page**

* Display uploaded results
* Filter by course/session/semester

### 6. **Documents List Page**

* Display uploaded documents
* (HOD only) approve/reject buttons

---

## ✔ Notes for Developer

* Keep design **simple**, clean, and functional.
* No need for animations or a complex layout.
* Focus on **making all backend endpoints work properly**.
* This is an **MVP for pitching**, not final production software.

---



