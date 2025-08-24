# 🥗 FoodCloud: Cloud-Based NGO & Waste Food Management System

A cloud-powered MERN stack web application designed to help NGOs manage and redistribute surplus food from donors (restaurants, events, households) to the underprivileged. It bridges the gap between food donors and volunteers using real-time tracking, secure authentication, and optimized delivery logistics.

---

## 🚀 Key Features

- 🔐 **User Management**: Role-based login (NGO, Donor, Volunteer, Admin)
- 📦 **Donation Management**: Real-time food request form with image and location and availability tagging
- 🗺️ **Admin Management**: Comprehensive admin tools to manage users, food posts and system operations
- 🗺️ **Pickup & Delivery**: Route optimization for volunteers
- 📊 **Analytics Dashboard**: Track total donations, meals served, and more
- 🛡️ **Security**: JWT authentication, bcrypt hashing, HTTPS
  
**Project Overview Diagram**

<img width="1536" height="1024" alt="20250729_2123_Dark Mode Diagram_remix_01k1be2zvve41s9xg9v65xdkxt" src="https://github.com/user-attachments/assets/44e7edf3-7284-461c-b5e0-3ef0d9f07113" />

---

## 📸 Screenshots

![Login Screen](GithubImages/login.png)

### 🔐 Login Screen
![Login Screen](<img width="937" height="842" alt="Screenshot 2025-08-24 224626" src="https://github.com/user-attachments/assets/214f7896-4053-4526-9ef0-a773befa4f36" />)

### 💬 Home Page
![NGO Dashboard](<img width="1818" height="830" alt="Screenshot 2025-08-24 224116" src="https://github.com/user-attachments/assets/31e84551-914b-4413-bf39-28d28f32274c" />)

### 💬 Donor Dashboard
![NGO Dashboard](<img width="1253" height="692" alt="Screenshot 2025-08-24 224640" src="https://github.com/user-attachments/assets/f2ede69d-f247-481e-ac59-0eb73917a315" />)

### 💬 Admin Dashboard
![NGO Dashboard](<img width="1440" height="868" alt="Screenshot 2025-08-24 224349" src="https://github.com/user-attachments/assets/938daafe-0415-44eb-8628-ce3125f5bdfa" />)

### 💬 Food Posts
![NGO Dashboard](<img width="1861" height="907" alt="Screenshot 2025-08-24 230712" src="https://github.com/user-attachments/assets/e1f9f820-9d20-4520-9dc3-f52992fd4664" />)

---

## 🧰 Tech Stack

### 🌐 Frontend
- React.js (Vite)
- HTML5, CSS3, Bootstrap 5
- Axios
- 
### ⚙️ Backend
- Node.js + Express.js
- JWT Authentication
- Cloudinary for image uploads
- RESTful APIs

### 🗄️ Database
- MongoDB Atlas (Cloud)
- Mongoose ODM

### ☁️ Cloud & Hosting
- Render / Docker (Backend deployment)
- Vercel / Netlify (Frontend deployment)

### ✅ Testing
- Jest, Mocha
- Postman for API testing

---

## 📂 Project Structure ( Not updated )

```bash
client/                  # React Frontend
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx

server/                  # Node.js Backend
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
└── server.js
```

## 📦 Prerequisites

- Node.js
- MongoDB Atlas
- Postman for testing APIs

## 🛠️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/foodcloud.git

# 2. Navigate into the project folder
cd foodcloud

# 3. Install backend dependencies
cd server
npm install

# 4. Install frontend dependencies
cd client
cd frontend
npm install

# 5. Build frontend (optional for deployment)
npm run build
```
## 🧪 Usage (Dev Mode)

```bash
# Run the backend server
cd server
npm start

# Run the frontend app
cd client
cd frontend
npm run dev

Then open http://localhost:5173 in your browser.
```
## 🧾 Agile Milestones (6 Weeks)

| Week | Sprint Goal                                |
| ---- | ------------------------------------------ |
| 1️⃣  | Planning, Environment Setup, Schema Design |
| 2️⃣  | User Authentication, Role Management       |
| 3️⃣  | Food Posting & Request Module              |
| 4️⃣  | Volunteer Assignment & Status Lifecycle    |
| 5️⃣  | Admin Dashboard, Cloud Deployment          |
| 6️⃣  | Testing, UI Polishing, Documentation       |

## 📈 Future Enhancements

- 🔔 Push Notifications via Firebase
- 🌐 Multi-language support
- 📱 SMS reminders for pickups
- 📦 QR code-based delivery verification

## 🤝 Contributors
- Rupayan Kumar
- Subhajit Sadhukan
- Saptarshi Dutta
- Rishab Das

## 📃 License
This project is licensed under the MIT License.
