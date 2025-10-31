"# JIRAMS - Judicial Information & Records Management System

A modern, full-stack case filing system for civilians to submit and track court cases with a polished UI and FastAPI backend.

## 🎨 Features

### Civilian User Interface
- **Modern Dashboard** - Statistics, recent cases, and quick actions
- **File New Case** - Enhanced form with drag-and-drop file upload for evidence (images, videos, PDFs)
- **My Cases** - View, edit, and delete cases (before review)
- **Case Status** - Track case progress with admin feedback and timeline
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Professional UI** - Clean, minimal design with TailwindCSS and Lucide icons

### Admin Portal (Prosecutor/Judge/Registrar)
- **Admin Dashboard** - Real-time statistics and case metrics
- **Case Management** - View, search, filter, and sort all cases
- **Case Details** - Complete view with evidence and submitter info
- **Evidence Viewer** - View uploaded files with type indicators
- **Feedback System** - Add notes and communicate with civilians
- **Status Updates** - Change case status through workflow
- **Pagination** - Efficient browsing with 10 cases per page
- **Role-Based Access** - Different permissions for different admin roles
- **Dark Theme** - Professional dark sidebar with modern design

### Backend (FastAPI)
- **RESTful API** - Well-structured endpoints for all operations
- **JWT Authentication** - Secure token-based authentication
- **File Upload** - Support for multiple file types (images, videos, documents)
- **Database Models** - SQLAlchemy ORM with proper relationships
- **Admin Endpoints** - Specialized routes for case management
- **Role-Based Authorization** - Middleware for permission checking
- **CORS Enabled** - Cross-origin support for frontend integration

## 📁 Project Structure

```
JIRAMS-STARTER/
├── backend/
│   ├── app/
│   │   ├── api/routers/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── cases.py         # Case management (CRUD + status)
│   │   │   ├── evidence.py      # Evidence upload/retrieval
│   │   │   ├── documents.py     # Document management
│   │   │   ├── hearings.py      # Hearing scheduling
│   │   │   ├── payments.py      # Payment tracking
│   │   │   └── users.py         # User management
│   │   ├── core/
│   │   │   └── security.py      # JWT & password hashing
│   │   ├── db/
│   │   │   └── session.py       # Database session
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── database.py          # Database configuration
│   │   └── main.py              # FastAPI app entry point
│   └── requirements.txt         # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── pages/civilian/
    │   │   ├── CivilianDashboard.js      # Modern dashboard
    │   │   ├── CivilianNewCase.js        # Case filing with file upload
    │   │   ├── CivilianMyCases.js        # Case list with edit/delete
    │   │   └── CivilianCaseStatus.js     # Status tracking with feedback
    │   ├── layouts/
    │   │   └── CivilianLayout.js         # Sidebar navigation layout
    │   ├── auth/
    │   │   └── AuthContext.js            # Authentication context
    │   ├── config/
    │   │   └── api.js                    # Axios configuration
    │   └── routes/
    │       ├── index.js                  # Main routes
    │       └── CivilianRoutes.js         # Civilian routes
    ├── tailwind.config.js                # TailwindCSS configuration
    ├── postcss.config.js                 # PostCSS configuration
    └── package.json                      # Node dependencies

## 🚀 Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Mac/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the backend server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   Backend will be available at: `http://localhost:8000`
   API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

   Frontend will be available at: `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /auth/token` - Login (returns JWT token)
- `POST /auth/register` - Register new user

### Civilian Cases
- `POST /cases/` - Create new case (JSON)
- `GET /cases/mine/{email}` - Get user's cases
- `GET /cases/{id}/status` - Get case status with feedback
- `PUT /cases/{id}/civilian` - Update case (civilian, before review)
- `DELETE /cases/{id}` - Delete case (civilian, before review)

### Admin Cases
- `GET /cases/admin/all` - Get all cases (with filters)
- `GET /cases/admin/{id}` - Get complete case details
- `PUT /cases/admin/{id}` - Update case status/assignment
- `POST /cases/admin/feedback` - Add feedback to case

### Evidence
- `POST /evidence/` - Upload evidence
- `GET /evidence/case/{case_id}` - Get case evidence
- `GET /evidence/uploader/{email}` - Get user's uploaded evidence

## 👤 Default Users

The system seeds default users on startup:

### **Civilian User**
- Email: `civilian@courts.com`
- Password: `ci1234`
- Access: File cases, upload evidence, track status

### **Admin Users**
- **Prosecutor**: `prosecutor@courts.com` / `po1234`
- **Judge**: `judge@courts.com` / `ju1234`
- **Registrar**: `registrar@courts.com` / `re1234`
- Access: View all cases, add feedback, update status

## 🎨 UI Features

### Color Scheme
- **Primary**: Blue (`#0ea5e9`) - Professional, trustworthy
- **Accent**: Green (`#22c55e`) - Success, positive actions
- **Background**: Light gray (`#f9fafb`) - Clean, modern

### Components
- **Sidebar Navigation** - Collapsible, icon-based navigation
- **Top Bar** - User info, notifications, logout
- **Dashboard Cards** - Statistics with animated icons
- **File Upload** - Drag-and-drop interface with preview
- **Status Badges** - Color-coded case statuses
- **Feedback Timeline** - Admin comments with timestamps

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt password encryption
- **CORS Protection** - Configured allowed origins
- **Role-based Access** - Civilians can only edit/delete pending cases
- **File Validation** - Type and size restrictions on uploads

## 📱 Responsive Design

The interface is fully responsive:
- Mobile: Collapsible sidebar, stacked layouts
- Tablet: Optimized spacing and touch targets
- Desktop: Full sidebar, multi-column layouts

## 🔧 Technology Stack

### Backend
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite (Database)
- JWT (Authentication)
- Passlib (Password hashing)

### Frontend
- React 18
- React Router 6
- TailwindCSS (Styling)
- Lucide React (Icons)
- React Dropzone (File upload)
- Axios (HTTP client)

## 📚 Usage

### **For Civilians**

1. **Login** as a civilian user (`civilian@courts.com` / `ci1234`)
2. **Navigate** to "New Case" from the sidebar
3. **Fill in** case details (title, category, description)
4. **Upload** evidence files via drag-and-drop
5. **Submit** the case
6. **Track** case status in "Case Status" page
7. **View** admin feedback and timeline
8. **Edit/Delete** cases before they're reviewed

### **For Admins (Prosecutor/Judge/Registrar)**

1. **Login** with admin credentials
2. **View Dashboard** - See statistics and recent cases
3. **Browse Cases** - Search, filter, and sort submissions
4. **Review Details** - Click any case to see full information
5. **View Evidence** - Check uploaded files and documents
6. **Add Feedback** - Communicate with civilians
7. **Update Status** - Move cases through workflow
8. **Track Progress** - Monitor case resolution

## 📖 Documentation

- **README.md** - Main project documentation
- **QUICKSTART.md** - 5-minute setup guide
- **FEATURES.md** - Detailed civilian features
- **ADMIN_DASHBOARD.md** - Complete admin guide
- **API Docs** - Interactive docs at `http://localhost:8000/docs`

## 🎯 Next Steps

- Deploy to production (Heroku, AWS, Vercel)
- Add email notifications to civilians
- Implement real-time updates via WebSockets
- Add document generation (PDF reports)
- Integrate payment gateway
- Add bulk case operations
- Implement user profile management
- Add case priority levels
- Create reporting dashboard
- Add audit logging

## 📄 License

MIT License - feel free to use for your projects!

---

Built with ❤️ using FastAPI and React" 
