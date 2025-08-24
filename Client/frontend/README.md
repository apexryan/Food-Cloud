# FoodCloud Connect Frontend

A React-based frontend for the FoodCloud Connect application, built with Vite and Material-UI.

## Features

- 🔐 **Authentication System**: Login, register, and password reset for all user types (User, NGO, Volunteer, Admin)
- 🍽️ **Food Post Management**: Create, view, edit, and delete food posts with image upload
- 📱 **Responsive Design**: Mobile-friendly interface with Material-UI components
- 🎨 **Modern UI**: Clean and intuitive user interface
- 🔒 **Protected Routes**: Role-based access control
- 📊 **Dashboard**: User-specific dashboards for different roles

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following content:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints Used

The frontend connects to the following backend endpoints:

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/change-password` - Change password

### User Management (Admin)

- `POST /api/users` - Create new users
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user

### Food Posts

- `POST /api/food` - Create food post
- `GET /api/food` - Get all food posts
- `PUT /api/food/:id` - Update food post
- `DELETE /api/food/:id` - Delete food post

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   ├── food/
│   │   ├── FoodPosts.jsx
│   │   └── CreateFoodPost.jsx
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── Navigation.jsx
│   └── ProtectedRoute.jsx
├── contexts/
│   └── AuthContext.jsx
├── services/
│   └── apiService.js
├── App.jsx
└── main.jsx
```

## User Roles

- **User**: Can create and manage their own food posts
- **NGO**: Can view and manage food posts, work with volunteers
- **Volunteer**: Can help with food distribution
- **Admin**: Full system access and user management

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Material-UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## Backend Requirements

Make sure your backend server is running on `http://localhost:5000` with the following features:

- CORS enabled
- JWT authentication
- File upload support (for images)
- MongoDB database
- All the API endpoints listed above

## Troubleshooting

1. **CORS Issues**: Ensure your backend has CORS properly configured
2. **Authentication Issues**: Check that JWT tokens are being sent correctly
3. **Image Upload Issues**: Verify that your backend supports multipart/form-data
4. **API Connection**: Make sure the backend server is running and accessible

## Development Notes

- The frontend uses Vite for fast development and building
- Material-UI provides a consistent design system
- All API calls are centralized in the `apiService.js` file
- Authentication state is managed through React Context
- Protected routes ensure proper access control
