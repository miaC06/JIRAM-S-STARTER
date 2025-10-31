# 🚀 Quick Start Guide - JIRAMS

Get your case filing system running in 5 minutes!

## Prerequisites

- Python 3.8+ installed
- Node.js 14+ and npm installed
- Terminal/Command Prompt access

## Step-by-Step Setup

### 1️⃣ Start Backend (Terminal 1)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

✅ Backend running at: http://localhost:8000
📚 API Docs at: http://localhost:8000/docs

---

### 2️⃣ Start Frontend (Terminal 2)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm start
```

✅ Frontend running at: http://localhost:3000

---

### 3️⃣ Login & Test

1. **Open browser**: http://localhost:3000
2. **Login** with test credentials:
   - Email: `civilian@courts.com`
   - Password: `ci1234`

3. **Explore features**:
   - View the dashboard
   - File a new case
   - Upload evidence files
   - Track case status

---

## 🎯 Common Commands

### Backend
```bash
# Start server
uvicorn app.main:app --reload --port 8000

# View API documentation
# Open: http://localhost:8000/docs
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build
```

---

## 🔐 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Civilian | civilian@courts.com | ci1234 |
| Prosecutor | prosecutor@courts.com | po1234 |
| Judge | judge@courts.com | ju1234 |
| Registrar | registrar@courts.com | re1234 |

---

## 📝 Quick Feature Test

1. **Login** as civilian user
2. Click **"New Case"** in sidebar
3. Fill case details:
   - Title: "Test Case"
   - Category: "Civil"
   - Description: "Testing the system"
4. **Drag & drop** a test image/PDF
5. Click **"Submit Case"**
6. View your case in **"My Cases"**
7. Check **"Case Status"** for tracking

---

## ❓ Troubleshooting

### Backend won't start?
- ✅ Check Python version: `python --version`
- ✅ Activate virtual environment
- ✅ Install dependencies: `pip install -r requirements.txt`

### Frontend won't start?
- ✅ Check Node version: `node --version`
- ✅ Delete `node_modules` and run `npm install` again
- ✅ Clear cache: `npm cache clean --force`

### Can't login?
- ✅ Make sure backend is running on port 8000
- ✅ Check console for errors (F12 in browser)
- ✅ Try the test credentials exactly as shown

---

## 🎨 What to Try

1. **Dashboard** - See case statistics and quick actions
2. **File Case** - Use drag-and-drop file upload
3. **My Cases** - Edit/delete pending cases
4. **Case Status** - View progress timeline
5. **Responsive** - Try on mobile view (resize browser)

---

## 📚 Next Steps

- Read full documentation: `README.md`
- Explore API endpoints: http://localhost:8000/docs
- Customize colors in `tailwind.config.js`
- Add more features using existing patterns

---

## 💡 Tips

- The database is created automatically on first run
- Test users are seeded automatically
- Files are stored in `backend/uploads/` and `backend/uploaded_evidence/`
- Use the browser developer tools (F12) to debug

---

**Need help?** Check the full README.md or API documentation!

Happy coding! 🎉
