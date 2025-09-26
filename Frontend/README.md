# Planets Universe - Frontend

A modern React frontend application for exploring and managing planets in our solar system. Built with React, Vite, Tailwind CSS, and integrated with a FastAPI backend.

## 🌟 Features

- **Authentication**: JWT-based login system with protected routes
- **Planet Directory**: Browse all planets with search and filtering
- **Planet Details**: Detailed view of individual planets
- **Admin Panel**: Full CRUD operations for planet management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Beautiful gradient backgrounds and smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navigation.jsx   # Navigation bar component
│   └── ProtectedRoute.jsx # Route protection wrapper
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Planets.jsx    # Planets directory
│   ├── PlanetDetail.jsx # Individual planet view
│   └── AdminPanel.jsx # Admin management panel
├── api.js             # API client with JWT handling
├── App.jsx            # Main app component with routing
├── main.jsx           # App entry point
└── index.css          # Global styles and Tailwind imports
```

## 🔐 Authentication

The app uses JWT tokens for authentication:

- **Login**: POST `/auth/login` with username/password
- **Token Storage**: JWT stored in localStorage
- **Auto-logout**: Automatic redirect on 401 responses
- **Protected Routes**: Admin panel requires authentication

### Demo Credentials

- **Admin**: `admin` / `admin123`
- **User**: `testuser` / `test123`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

The app uses Tailwind CSS with custom configurations:

- **Color Scheme**: Space-themed with primary blues and grays
- **Typography**: Inter font family
- **Responsive**: Mobile-first design approach
- **Components**: Custom button and form styles
- **Animations**: Smooth transitions and hover effects

## 🔌 API Integration

The frontend communicates with the FastAPI backend:

- **Base URL**: `http://localhost:8000`
- **Endpoints**:
  - `GET /planets` - List all planets
  - `GET /planets/{id}` - Get planet details
  - `POST /planets` - Create planet (auth required)
  - `PUT /planets/{id}` - Update planet (auth required)
  - `DELETE /planets/{id}` - Delete planet (auth required)
  - `POST /auth/login` - User login
  - `GET /auth/me` - Get current user info

## 📱 Responsive Design

The app is fully responsive with breakpoints:

- **Mobile**: `< 640px` - Single column layout
- **Tablet**: `640px - 1024px` - Two column layout
- **Desktop**: `> 1024px` - Multi-column layout

## 🚦 Route Structure

- `/` - Redirects to `/planets`
- `/login` - Login page (redirects if authenticated)
- `/planets` - Planets directory (protected)
- `/planets/:id` - Planet detail page (protected)
- `/admin` - Admin panel (protected)

## 🎯 Key Features

### Planet Directory
- Grid layout with planet cards
- Search by name or description
- Filter by planet type
- Responsive design

### Planet Details
- Comprehensive planet information
- Physical and orbital characteristics
- Formatted numbers and measurements
- Navigation breadcrumbs

### Admin Panel
- Full CRUD operations
- Modal forms for create/edit
- Confirmation dialogs for deletion
- Real-time updates

### Authentication
- JWT token management
- Automatic token refresh
- Route protection
- User session management

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Vite Configuration

The app includes proxy configuration for API calls:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend has CORS enabled
2. **API Connection**: Verify backend is running on port 8000
3. **Authentication**: Check JWT token in localStorage
4. **Build Issues**: Clear node_modules and reinstall

### Development Tips

- Use browser dev tools to inspect API calls
- Check network tab for failed requests
- Verify JWT token expiration
- Test on different screen sizes

## 📄 License

This project is part of the Planets Universe application suite.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Exploring! 🚀**
