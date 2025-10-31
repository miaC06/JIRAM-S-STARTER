# 👔 Admin Dashboard Documentation - JIRAMS

Complete guide for prosecutors, judges, and registrars to manage civilian case submissions.

---

## 🎯 Overview

The Admin Dashboard provides a comprehensive case management interface for court officials (prosecutors, judges, and registrars) to review, process, and respond to case submissions from civilians.

### **Key Features**

✅ **Dashboard with Statistics** - Real-time case metrics and trends  
✅ **Case List with Filters** - Search, filter, sort, and paginate cases  
✅ **Case Details View** - Complete case information with evidence  
✅ **Evidence Viewer** - View uploaded files (images, videos, documents)  
✅ **Feedback System** - Add notes and communicate with civilians  
✅ **Status Management** - Update case status as it progresses  
✅ **Role-Based Access** - Different permissions for different roles  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

---

## 📁 File Structure

```
frontend/src/
├── layouts/
│   └── AdminLayout.js              # Admin sidebar & navbar
├── pages/admin/
│   ├── AdminDashboard.js           # Statistics dashboard
│   ├── AdminCaseList.js            # Case listing with filters
│   └── AdminCaseDetails.js         # Case details with feedback
└── routes/
    ├── ProsecutorRoutes.js         # Prosecutor routes
    ├── JudgeRoutes.js              # Judge routes
    └── RegistrarRoutes.js          # Registrar routes

backend/app/api/routers/
└── cases.py                        # Admin endpoints added
```

---

## 🚀 Getting Started

### **Login as Admin**

Use these test credentials:

```
Prosecutor:  prosecutor@courts.com / po1234
Judge:       judge@courts.com / ju1234
Registrar:   registrar@courts.com / re1234
```

### **Access Your Dashboard**

After login, you'll be redirected to your role-specific dashboard:
- **Prosecutor**: `/prosecutor/dashboard`
- **Judge**: `/judge/dashboard`
- **Registrar**: `/registrar/dashboard`

---

## 🎨 User Interface

### **1. Admin Layout**

**Sidebar Navigation:**
- Dashboard
- All Cases
- Users
- Reports
- Documents
- Settings

**Top Bar:**
- Role badge (Prosecutor/Judge/Registrar)
- Notifications bell
- User email
- Logout button

**Dark Theme Sidebar:**
- Gradient gray background
- Primary blue highlights for active items
- Collapsible for mobile

---

### **2. Dashboard Page**

**Statistics Cards:**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Cases │   Pending   │Under Review │  Completed  │
│     45      │     12      │      8      │     25      │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Quick Actions:**
- Review Pending - Jump to pending cases
- View All Cases - Browse all submissions
- Manage Users - Access user management

**Recent Cases Table:**
- Last 10 case submissions
- Click any row to view details
- Color-coded status badges

---

### **3. Case List Page**

**Features:**

📊 **Search Bar**
- Search by case title, description, or submitter
- Real-time filtering

🔍 **Status Filter**
- All Statuses
- Pending
- Under Review
- Reviewed
- Closed

🎯 **Quick Filter Buttons**
- One-click status filtering
- Visual active state

📄 **Pagination**
- 10 cases per page
- Previous/Next navigation
- Total count display

**Table Columns:**
- Case ID
- Title & Description
- Category
- Submitted By
- Status Badge
- Date
- Actions (View button)

---

### **4. Case Details Page**

**Left Column - Case Information:**

📋 **Case Details Card**
- Title
- Category
- Description
- Additional Notes
- Submission Date
- Submitter Information

📎 **Evidence Card**
- List of uploaded files
- File type icons (Image/Video/Document)
- Upload date and category
- Uploader information

💬 **Feedback History**
- Previous admin comments
- Author and timestamp
- Chronological order

**Right Column - Actions:**

👤 **Submitter Info**
- User email
- User role
- Contact information

⚙️ **Update Status**
- Dropdown selector:
  - Pending
  - Under Review
  - Reviewed
  - Closed
- Update button

✍️ **Add Feedback**
- Text area for comments
- Send feedback button
- Visible to civilian user

---

## 🔧 Backend API Endpoints

### **Admin Case Management**

```http
GET /cases/admin/all
```
**Description:** Get all cases with optional filters  
**Query Parameters:**
- `status` (optional) - Filter by status
- `search` (optional) - Search term

**Response:**
```json
[
  {
    "id": 1,
    "title": "Property Dispute",
    "description": "Land boundary issue",
    "category": "Property",
    "status": "PENDING",
    "created_by": "civilian@courts.com",
    "created_at": "2025-10-30T12:00:00"
  }
]
```

---

```http
GET /cases/admin/{case_id}
```
**Description:** Get complete case details including evidence and feedback

**Response:**
```json
{
  "id": 1,
  "title": "Property Dispute",
  "description": "Details...",
  "category": "Property",
  "status": "PENDING",
  "created_by": {
    "id": 2,
    "email": "civilian@courts.com",
    "role": "CIVILIAN"
  },
  "evidences": [
    {
      "id": 1,
      "filename": "evidence.pdf",
      "filetype": "application/pdf",
      "uploaded_at": "2025-10-30T12:00:00"
    }
  ],
  "case_notes": [
    {
      "id": 1,
      "note": "Case under review",
      "author": "judge@courts.com",
      "created_at": "2025-10-30T13:00:00"
    }
  ]
}
```

---

```http
PUT /cases/admin/{case_id}
```
**Description:** Update case status or assignment  
**Query Parameters:**
- `admin_email` - Email of admin making the update

**Request Body:**
```json
{
  "status": "Under Review",
  "assigned_to_id": 3
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Property Dispute",
  "status": "Under Review",
  "message": "Case updated successfully"
}
```

---

```http
POST /cases/admin/feedback
```
**Description:** Add feedback/note to a case

**Request Body:**
```json
{
  "case_id": 1,
  "author_email": "judge@courts.com",
  "note": "Please provide additional documentation"
}
```

**Response:**
```json
{
  "id": 5,
  "note": "Please provide additional documentation",
  "author": "judge@courts.com",
  "created_at": "2025-10-30T14:00:00",
  "message": "Feedback added successfully"
}
```

---

## 🔒 Role-Based Access Control

### **Backend Validation**

All admin endpoints check:
```python
if admin.role not in ["PROSECUTOR", "JUDGE", "REGISTRAR"]:
    raise HTTPException(status_code=403, detail="Not authorized")
```

### **Frontend Protection**

Routes are wrapped in `ProtectedRoute` component:
```jsx
<ProtectedRoute>
  <AdminLayout>
    <AdminDashboard />
  </AdminLayout>
</ProtectedRoute>
```

### **Permission Matrix**

| Action | Prosecutor | Judge | Registrar |
|--------|------------|-------|-----------|
| View Cases | ✅ | ✅ | ✅ |
| Update Status | ✅ | ✅ | ✅ |
| Add Feedback | ✅ | ✅ | ✅ |
| Assign Cases | ✅ | ✅ | ✅ |
| Delete Cases | ❌ | ❌ | ✅ |

---

## 📊 Case Status Workflow

```
┌─────────┐
│ PENDING │ ← Civilian submits case
└────┬────┘
     │
     ↓
┌──────────────┐
│ UNDER REVIEW │ ← Admin starts review
└──────┬───────┘
       │
       ↓
  ┌─────────┐
  │ REVIEWED│ ← Admin completes review
  └────┬────┘
       │
       ↓
   ┌────────┐
   │ CLOSED │ ← Case resolution
   └────────┘
```

**Status Descriptions:**
- **PENDING** - Awaiting admin review
- **UNDER REVIEW** - Being processed by admin
- **REVIEWED** - Review complete, feedback provided
- **CLOSED** - Case closed/resolved

---

## 🎯 Common Workflows

### **Workflow 1: Review Pending Case**

1. Login as admin
2. Click "Review Pending" quick action
3. See filtered list of pending cases
4. Click case to view details
5. Review case information and evidence
6. Update status to "Under Review"
7. Add feedback for civilian
8. Click "Send Feedback"

---

### **Workflow 2: Search and Filter Cases**

1. Go to "All Cases" from sidebar
2. Enter search term (e.g., "property")
3. Or click status filter button (e.g., "Pending")
4. Browse filtered results
5. Navigate pages if needed
6. Click "View" to see details

---

### **Workflow 3: Complete Case Review**

1. Open case details page
2. Review all information and evidence
3. Add feedback: "Documents approved. Case forwarded to judge."
4. Change status from "Under Review" to "Reviewed"
5. Click "Update Status"
6. Civilian will see feedback in their status page

---

## 🎨 Design System

### **Colors**

**Admin Theme:**
- Sidebar: Dark gray gradient (#1f2937 → #111827)
- Primary: Blue (#0ea5e9)
- Accent: Purple, Green (role-based)
- Status Colors:
  - Yellow: Pending
  - Blue: Under Review
  - Green: Reviewed
  - Gray: Closed

### **Typography**
- Headers: Bold, 18-24px
- Body: Regular, 14px
- Small: 12px (metadata)

### **Components**
- Cards: White background, border, rounded-xl
- Buttons: Primary blue, hover effects
- Tables: Striped rows, hover states
- Badges: Rounded, color-coded by status

---

## 📱 Responsive Design

**Breakpoints:**
- Mobile: < 768px (Collapsed sidebar, stacked layout)
- Tablet: 768-1024px (Partial sidebar)
- Desktop: > 1024px (Full layout)

**Mobile Optimizations:**
- Hamburger menu
- Touch-friendly buttons (48x48px)
- Simplified tables (scroll horizontal)
- Bottom navigation consideration

---

## ⚡ Performance Tips

1. **Pagination** - Only 10 cases loaded per page
2. **Lazy Loading** - Evidence files loaded on demand
3. **Debounced Search** - Reduces API calls
4. **Cached Status** - Local state management
5. **Optimistic Updates** - Instant UI feedback

---

## 🐛 Troubleshooting

### **Can't see any cases**
- Check if backend is running on port 8000
- Verify you're logged in as admin role
- Check browser console for errors

### **Feedback not sending**
- Verify feedback text is not empty
- Check network tab for API errors
- Ensure you have admin role

### **Status not updating**
- Select a different status than current
- Check admin_email parameter
- Verify role permissions

---

## 🚀 Deployment Checklist

- [ ] Update API base URL in `config/api.js`
- [ ] Build production bundle: `npm run build`
- [ ] Set environment variables
- [ ] Configure CORS on backend
- [ ] Test all admin workflows
- [ ] Verify role-based access
- [ ] Check mobile responsiveness

---

## 📚 Next Features

Future enhancements to consider:

- [ ] Real-time updates (WebSockets)
- [ ] Email notifications to civilians
- [ ] Bulk case operations
- [ ] Advanced reporting
- [ ] Case assignment workflow
- [ ] File preview modal
- [ ] Export to PDF/CSV
- [ ] Audit log
- [ ] Dark mode toggle
- [ ] Case priority levels

---

## 🎓 Training Materials

### **For Administrators**

1. **Getting Started** (5 min)
   - Login process
   - Dashboard overview
   - Navigation basics

2. **Case Management** (10 min)
   - Search and filter
   - Viewing case details
   - Understanding evidence

3. **Providing Feedback** (5 min)
   - Adding comments
   - Updating status
   - Best practices

4. **Advanced Features** (10 min)
   - Pagination
   - Quick filters
   - Keyboard shortcuts

---

## 📞 Support

**Technical Issues:**
- Check API documentation: `http://localhost:8000/docs`
- Review console logs (F12 in browser)
- Verify backend is running

**Feature Requests:**
- Submit via issue tracker
- Contact development team

---

**Built with ❤️ for efficient case management!** 🚀
