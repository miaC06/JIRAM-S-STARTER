# 🧪 Testing Guide - JIRAMS Complete System

Comprehensive testing workflows for both civilian and admin interfaces.

---

## 🚀 Pre-Testing Setup

### **1. Start Backend**
```powershell
cd backend
venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

### **2. Start Frontend**
```powershell
cd frontend
npm start
```

### **3. Delete Old Database (if needed)**
```powershell
# Stop backend first (Ctrl+C)
cd backend
del app.db
# Restart backend
uvicorn app.main:app --reload --port 8000
```

---

## 👤 Test Credentials

```
Civilian:   civilian@courts.com / ci1234
Prosecutor: prosecutor@courts.com / po1234
Judge:      judge@courts.com / ju1234
Registrar:  registrar@courts.com / re1234
```

---

## 🎯 Test Scenario 1: Complete Civilian Workflow

### **Step 1: Login as Civilian**
1. Go to `http://localhost:3000`
2. Enter email: `civilian@courts.com`
3. Enter password: `ci1234`
4. Click "Login"

**✅ Expected:** Redirect to civilian dashboard

---

### **Step 2: View Dashboard**
1. Check statistics cards display:
   - Total Cases
   - Pending
   - Reviewed
   - Closed
2. Verify quick action buttons are clickable
3. Check recent cases table (may be empty initially)

**✅ Expected:** Clean, responsive dashboard loads

---

### **Step 3: File New Case**
1. Click "New Case" in sidebar
2. Fill in form:
   - Title: "Property Boundary Dispute"
   - Category: Select "Property"
   - Description: "Neighbor constructed fence on my land"
   - Notes: "Urgent resolution needed"
3. Drag and drop 2-3 files (images or PDFs)
4. Verify files appear in preview list
5. Click "Submit Case"

**✅ Expected:**
- Green success message appears
- Redirect to "My Cases" page
- Case appears in list

---

### **Step 4: View My Cases**
1. Click "My Cases" in sidebar
2. Verify case appears in list
3. Check status badge shows "PENDING"
4. Try search functionality
5. Try status filter dropdown
6. Click "View Details"

**✅ Expected:**
- Case listed with correct information
- Search and filters work
- Details page opens

---

### **Step 5: Edit Case (Before Review)**
1. In "My Cases", click "Edit" button
2. Modify title to "Property Boundary Dispute - Updated"
3. Click "Save Changes"

**✅ Expected:**
- Success message
- Changes saved
- Title updated in list

---

### **Step 6: Check Case Status**
1. Click "Case Status" in sidebar
2. Select your case from list
3. View case details, status, and timeline
4. Check feedback section (will be empty initially)

**✅ Expected:**
- Case status displays correctly
- Timeline shows submission
- "No feedback yet" message shows

---

## 👔 Test Scenario 2: Admin Review Workflow

### **Step 1: Login as Prosecutor**
1. Logout from civilian account
2. Login with: `prosecutor@courts.com` / `po1234`

**✅ Expected:** Redirect to prosecutor dashboard with dark sidebar

---

### **Step 2: View Admin Dashboard**
1. Check statistics:
   - Total Cases (should show 1)
   - Pending (should show 1)
2. View recent cases table
3. Click on the case row

**✅ Expected:**
- Dashboard shows correct stats
- Case appears in recent list
- Details page opens

---

### **Step 3: Review Case Details**
1. Read case title and description
2. Check submitter information
3. View evidence files listed
4. Check category and notes

**✅ Expected:**
- All case information displays
- Evidence files shown
- Submitter email visible

---

### **Step 4: Update Case Status**
1. In right sidebar, find "Update Status"
2. Change status from "PENDING" to "Under Review"
3. Click "Update Status"

**✅ Expected:**
- Green success message
- Status badge updates to blue "Under Review"
- Changes reflected immediately

---

### **Step 5: Add Feedback**
1. Scroll to "Add Feedback" section
2. Type: "Case received. Currently reviewing documentation. Please provide property deed if available."
3. Click "Send Feedback"

**✅ Expected:**
- Success message
- Feedback appears in "Feedback History"
- Shows prosecutor email and timestamp

---

### **Step 6: Browse All Cases**
1. Click "All Cases" in sidebar
2. Try search: Type "property"
3. Try filter: Click "Under Review" button
4. Test pagination (if multiple cases)

**✅ Expected:**
- Case list loads
- Search filters results
- Status filter works
- Pagination functional

---

## 🔄 Test Scenario 3: Complete Workflow

### **Step 1: Civilian Checks for Feedback**
1. Logout from prosecutor account
2. Login as civilian
3. Go to "Case Status"
4. Select your case

**✅ Expected:**
- Status changed to "Under Review"
- Prosecutor's feedback message visible
- Timeline shows update

---

### **Step 2: Judge Reviews and Completes**
1. Logout from civilian
2. Login as: `judge@courts.com` / `ju1234`
3. Go to "All Cases"
4. Click on the property dispute case
5. Change status to "Reviewed"
6. Add feedback: "Case reviewed and approved. Proceeding to hearing."
7. Send feedback

**✅ Expected:**
- Status updates successfully
- Feedback added
- Both prosecutor and judge feedback visible

---

### **Step 3: Civilian Views Final Status**
1. Logout from judge
2. Login as civilian
3. Check "Case Status"

**✅ Expected:**
- Status shows "Reviewed"
- Both feedback messages visible
- Timeline complete

---

## 🔍 Test Scenario 4: Error Handling

### **Test 1: Try to Edit Reviewed Case**
1. Login as civilian
2. Go to "My Cases"
3. Try to click "Edit" on reviewed case

**✅ Expected:** Edit button disabled or hidden for reviewed cases

---

### **Test 2: Try to Delete Reviewed Case**
1. Try to click "Delete" on reviewed case

**✅ Expected:** Delete button disabled or hidden

---

### **Test 3: Login with Wrong Password**
1. Logout
2. Try login with: `civilian@courts.com` / `wrongpassword`

**✅ Expected:** "Invalid email or password" error

---

### **Test 4: Submit Case Without Title**
1. Login as civilian
2. Go to "New Case"
3. Leave title empty
4. Try to submit

**✅ Expected:** Form validation error, submission prevented

---

### **Test 5: Update Status Without Change**
1. Login as admin
2. View case details
3. Try to update status to same status

**✅ Expected:** Error message or button disabled

---

## 📱 Test Scenario 5: Responsive Design

### **Test on Different Screens**

1. **Desktop (1920x1080)**
   - Full sidebar visible
   - Multi-column layouts
   - All features accessible

2. **Tablet (768x1024)**
   - Sidebar collapsible
   - Two-column layouts
   - Touch-friendly buttons

3. **Mobile (375x667)**
   - Hamburger menu
   - Stacked layouts
   - Bottom navigation
   - Tables scroll horizontally

**✅ Test using Chrome DevTools (F12) → Device Toolbar**

---

## ⚡ Test Scenario 6: Performance

### **Load Testing**

1. **Create Multiple Cases**
   - File 15+ cases as civilian
   - Check pagination works (10 per page)
   - Verify navigation is smooth

2. **Search Performance**
   - Type in search box
   - Check immediate filtering
   - No lag or delays

3. **File Upload**
   - Upload 5MB file
   - Check progress indication
   - Verify upload completes

**✅ Expected:** Smooth performance, no freezing

---

## 🔒 Test Scenario 7: Security

### **Role-Based Access**

1. **Civilian Cannot Access Admin Routes**
   - Login as civilian
   - Manually navigate to `/prosecutor/dashboard`
   
   **✅ Expected:** Redirect or access denied

2. **Admin Cannot Edit Civilian Cases**
   - Login as admin
   - Try to access `/civilian/new-case`
   
   **✅ Expected:** Redirect or access denied

3. **Token Expiration**
   - Login and wait 30+ minutes
   - Try to perform action
   
   **✅ Expected:** Redirect to login

---

## 📊 Test Scenario 8: Data Integrity

### **Test Database Relationships**

1. **Create Case → Add Evidence**
   - File case
   - Upload 3 evidence files
   - Check all files linked to case

2. **Admin Feedback → Civilian View**
   - Admin adds feedback
   - Civilian sees feedback immediately
   - Feedback attributed correctly

3. **Status Changes → Timeline**
   - Change status multiple times
   - Check timeline reflects all changes
   - Timestamps accurate

**✅ Expected:** All data relationships correct

---

## 🎨 Test Scenario 9: UI/UX

### **Visual Testing**

1. **Color Consistency**
   - Primary blue used consistently
   - Status badges color-coded correctly
   - Dark theme for admin sidebar

2. **Animations**
   - Page transitions smooth
   - Loading spinners appear
   - Hover effects work

3. **Icons**
   - Correct icons for actions
   - Icons consistent size
   - Icons meaningful

4. **Typography**
   - Headings clear hierarchy
   - Body text readable
   - Font sizes appropriate

**✅ Expected:** Professional, polished appearance

---

## 🐛 Common Issues & Solutions

### **Issue: Login Fails**
**Solution:** 
- Delete app.db and restart backend
- Check password (case-sensitive)
- Verify backend running on port 8000

### **Issue: Cases Not Appearing**
**Solution:**
- Check browser console for errors
- Verify API base URL in `config/api.js`
- Ensure CORS enabled on backend

### **Issue: File Upload Fails**
**Solution:**
- Check file size (<10MB)
- Verify file type allowed
- Check `uploaded_evidence/` folder exists

### **Issue: Feedback Not Showing**
**Solution:**
- Refresh case details page
- Check admin email correct
- Verify feedback saved in database

---

## ✅ Testing Checklist

### **Civilian Interface**
- [ ] Login successful
- [ ] Dashboard displays correctly
- [ ] Can file new case
- [ ] Drag-and-drop upload works
- [ ] Can view my cases
- [ ] Can edit pending case
- [ ] Cannot edit reviewed case
- [ ] Can delete pending case
- [ ] Cannot delete reviewed case
- [ ] Can check case status
- [ ] Can view admin feedback
- [ ] Sidebar navigation works
- [ ] Logout works

### **Admin Interface**
- [ ] Login as prosecutor works
- [ ] Login as judge works
- [ ] Login as registrar works
- [ ] Dashboard shows stats
- [ ] Can view all cases
- [ ] Search functionality works
- [ ] Status filter works
- [ ] Pagination works
- [ ] Can view case details
- [ ] Can view evidence files
- [ ] Can update case status
- [ ] Can add feedback
- [ ] Feedback visible to civilian
- [ ] Role badge displays correctly
- [ ] Dark sidebar theme works

### **Backend**
- [ ] All endpoints respond
- [ ] Authentication works
- [ ] Role-based access enforced
- [ ] File uploads save correctly
- [ ] Database relationships intact
- [ ] Error handling proper
- [ ] CORS configured

### **Responsive Design**
- [ ] Works on desktop
- [ ] Works on tablet
- [ ] Works on mobile
- [ ] Sidebar collapses
- [ ] Tables scroll
- [ ] Buttons touch-friendly

---

## 📈 Performance Benchmarks

**Target Metrics:**
- Page Load: < 2 seconds
- API Response: < 500ms
- Search Filter: < 100ms
- File Upload (5MB): < 10 seconds
- Status Update: < 1 second

**Tools to Test:**
- Chrome DevTools → Network tab
- Lighthouse audit
- React Profiler

---

## 🎓 User Acceptance Testing

### **Civilian Users Should Be Able To:**
1. Easily understand how to file a case
2. Upload files without confusion
3. Track case progress clearly
4. Understand admin feedback
5. Navigate intuitively

### **Admin Users Should Be Able To:**
1. Quickly find pending cases
2. Review case details efficiently
3. Provide clear feedback
4. Update status easily
5. Manage multiple cases

---

## 📞 Reporting Issues

When reporting bugs, include:
1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Screenshots**
5. **Browser console errors**
6. **User role**
7. **Browser/OS**

---

## 🎉 Success Criteria

The system passes testing if:

✅ All test scenarios complete successfully  
✅ No critical bugs found  
✅ Performance meets benchmarks  
✅ UI is polished and professional  
✅ All user roles function correctly  
✅ Data integrity maintained  
✅ Security measures working  
✅ Responsive on all devices  

---

**Happy Testing! 🚀**
