# DevOps Roadmap App - Comprehensive Testing Guide

## Test Environment Setup
- **Browser**: Chrome/Firefox (latest version)
- **Clear cache**: Ctrl+Shift+Delete before testing
- **Console**: Keep Developer Console open (F12) to monitor errors
- **Network**: Check Network tab for failed requests

---

## 1. Authentication & User Management

### Test Case 1.1: User Registration
**Steps:**
1. Navigate to signup page
2. Enter email: `test.user@example.com`
3. Enter password: `TestPass123!`
4. Click "Sign Up"

**Expected Result:**
- ✅ User account created
- ✅ Redirected to dashboard
- ✅ User document created in Firestore
- ✅ No console errors

### Test Case 1.2: User Login
**Steps:**
1. Logout if logged in
2. Navigate to login page
3. Enter credentials from Test 1.1
4. Click "Login"

**Expected Result:**
- ✅ Successfully logged in
- ✅ Redirected to dashboard
- ✅ User data loaded
- ✅ Console shows "User doc found"

### Test Case 1.3: Session Persistence
**Steps:**
1. Login successfully
2. Refresh page (F5)
3. Wait for auth state to load

**Expected Result:**
- ✅ User remains logged in
- ✅ No redirect to login page
- ✅ Data loads automatically

---

## 2. Weekly Commitments (Accountability System)

### Test Case 2.1: Create Weekly Commitment
**Steps:**
1. Navigate to Accountability Dashboard
2. Click "Create New Commitment"
3. Add commitment:
   - Type: `study-hours`
   - Description: `Complete 10 hours of DevOps study`
   - Target: `10`
   - Public: ✓ Checked
   - Importance: `high`
4. Click "Create Commitments"

**Expected Result:**
- ✅ Commitment created in Firestore (`weeklyCommitments` collection)
- ✅ Commitment card displays with:
  - Week number and date range
  - Description shown
  - Progress bar at 0/10
  - Status: "pending"
  - Eye icon (public)
- ✅ No console errors

### Test Case 2.2: Update Commitment Progress
**Steps:**
1. On created commitment card
2. Click "Update Progress +1" button multiple times (5 times)

**Expected Result:**
- ✅ Progress updates: 0→1→2→3→4→5
- ✅ Progress bar fills to 50%
- ✅ Status changes to "in-progress"
- ✅ Firestore document updates in real-time

### Test Case 2.3: Complete Commitment
**Steps:**
1. Continue clicking "Update Progress +1" until target reached (5 more times)

**Expected Result:**
- ✅ Progress reaches 10/10
- ✅ Progress bar fills to 100% (green)
- ✅ Status changes to "completed"
- ✅ Update button disappears
- ✅ Overall status updates to "completed"

### Test Case 2.4: Delete Individual Commitment
**Steps:**
1. Click X icon on commitment card
2. Confirm deletion in dialog

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Commitment removed from list
- ✅ Document updated in Firestore
- ✅ If last commitment, entire weekly commitment deleted

### Test Case 2.5: Delete All Weekly Commitments
**Steps:**
1. Create 2-3 commitments
2. Click Trash icon in header
3. Confirm deletion

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ All commitments deleted
- ✅ "Create New Commitment" button appears
- ✅ Firestore document deleted

### Test Case 2.6: Multiple Commitment Types
**Test Data:**
```
Commitment 1:
- Type: study-hours
- Description: Study AWS 5 hours
- Target: 5
- Importance: high

Commitment 2:
- Type: labs-completed
- Description: Complete 3 hands-on labs
- Target: 3
- Importance: medium

Commitment 3:
- Type: exercises-completed
- Description: Finish 10 practice exercises
- Target: 10
- Importance: low
```

**Expected Result:**
- ✅ All commitments display with different importance colors
- ✅ Each can be updated independently
- ✅ Overall status reflects aggregate completion

---

## 3. Battle Drills

### Test Case 3.1: Start Battle Drill Session
**Steps:**
1. Navigate to Battle Drills page
2. Select difficulty: `beginner`
3. Select time limit: `5 minutes`
4. Click "Start Drill"

**Expected Result:**
- ✅ Drill interface loads
- ✅ Timer starts counting
- ✅ First question displays
- ✅ Answer options shown

### Test Case 3.2: Answer Questions
**Steps:**
1. Answer 5 questions (mix of correct/incorrect)
2. Observe timer counting down

**Expected Result:**
- ✅ Correct answers show green feedback
- ✅ Incorrect answers show red feedback
- ✅ Score updates in real-time
- ✅ Progress indicator advances

### Test Case 3.3: Complete Drill Session
**Steps:**
1. Complete all questions or wait for timer to expire
2. View results screen

**Expected Result:**
- ✅ Results summary shows:
  - Total score
  - Time taken
  - Accuracy percentage
  - Performance rating
- ✅ Session saved to Firestore (`battleDrillPerformance`)
- ✅ Option to retry or return to dashboard

### Test Case 3.4: Drill Performance Tracking
**Steps:**
1. Complete 3 drill sessions with different scores
2. Navigate to Analytics page
3. Check battle drill stats

**Expected Result:**
- ✅ Average drill time calculated
- ✅ Success rate displayed
- ✅ Completion count accurate
- ✅ Performance trends visible

---

## 4. Adaptive Difficulty System

### Test Case 4.1: Initial Difficulty Assessment
**Steps:**
1. Navigate to Adaptive Difficulty Dashboard
2. Check current difficulty level
3. View performance metrics

**Expected Result:**
- ✅ Current level displayed (beginner/intermediate/advanced)
- ✅ Performance metrics shown:
  - Quiz success rate
  - Lab completion rate
  - Battle drill performance
- ✅ Recommendations displayed

### Test Case 4.2: Difficulty Adjustment
**Steps:**
1. Complete multiple activities (quizzes, labs, drills) with high success (>80%)
2. Wait for system evaluation
3. Check for level-up recommendation

**Expected Result:**
- ✅ System tracks performance across activities
- ✅ Recommendation appears when thresholds met
- ✅ Can accept or decline recommendation
- ✅ Difficulty level updates if accepted

### Test Case 4.3: Weak Topic Identification
**Steps:**
1. Fail same topic multiple times
2. Check weak topics list

**Expected Result:**
- ✅ Topic appears in weak areas
- ✅ Easiness factor < 2.0
- ✅ Recommendations for improvement
- ✅ Can drill down on specific topic

---

## 5. Reset Token System

### Test Case 5.1: Allocate Weekly Tokens
**Steps:**
1. Navigate to Reset Tokens page
2. Check current week allocation
3. View token balance

**Expected Result:**
- ✅ Weekly allocation displayed (e.g., 3 tokens)
- ✅ Available tokens shown
- ✅ Used tokens count
- ✅ Week start/end dates shown

### Test Case 5.2: Use Reset Token
**Test Data:**
```
Failed Activity:
- Type: quiz-reset
- Item: "AWS Fundamentals Quiz"
- Original Score: 45%
```

**Steps:**
1. Use reset token on failed quiz
2. Confirm usage
3. Retake quiz

**Expected Result:**
- ✅ Token deducted from balance
- ✅ Reset token logged in Firestore
- ✅ Original attempt marked as reset
- ✅ Can retake activity
- ✅ Usage stats updated

### Test Case 5.3: Token Exhaustion
**Steps:**
1. Use all available tokens for the week
2. Attempt to use another token

**Expected Result:**
- ✅ "No tokens available" message
- ✅ Cannot reset more activities
- ✅ Shows when new tokens available
- ✅ Option to view usage history

### Test Case 5.4: Token Usage Analytics
**Steps:**
1. Use tokens across different activity types
2. Navigate to usage stats
3. Check breakdown

**Expected Result:**
- ✅ Total resets used displayed
- ✅ Breakdown by type (quiz/lab/drill)
- ✅ Average resets per week
- ✅ Most reset items listed
- ✅ Weekly trends shown

---

## 6. Analytics & Progress Tracking

### Test Case 6.1: Study Time Tracking
**Test Data:**
```
Study Sessions (create via API or direct Firestore):
Session 1: 2 hours, completed
Session 2: 1.5 hours, completed
Session 3: 3 hours, completed
```

**Steps:**
1. Navigate to Analytics page
2. Select time range: "Week"
3. View study time metrics

**Expected Result:**
- ✅ Total study time: 6.5 hours
- ✅ Total sessions: 3
- ✅ Average session duration: ~2.17 hours
- ✅ Best study hour identified
- ✅ No console errors

### Test Case 6.2: Mastery Progression
**Test Data:**
```
Progress Items:
- 5 items at "crawl" level
- 8 items at "walk" level
- 4 items at "run-guided" level
- 2 items at "run-independent" level
```

**Expected Result:**
- ✅ Mastery distribution chart shows all levels
- ✅ Mastery rate calculated correctly
- ✅ Weak topics highlighted (EF < 2.0)
- ✅ Progress visualization accurate

### Test Case 6.3: Streak Calculation
**Test Data:**
```
Study Sessions (consecutive days):
Day 1: 1 session
Day 2: 1 session
Day 3: 1 session
Day 4: 0 sessions (break)
Day 5: 1 session
```

**Expected Result:**
- ✅ Current streak: 1 day
- ✅ Longest streak: 3 days
- ✅ Streak breaks on missed day
- ✅ Visual indicator for streak

### Test Case 6.4: Time Range Filtering
**Steps:**
1. View analytics with "Week" filter
2. Switch to "Month" filter
3. Switch to "All Time" filter

**Expected Result:**
- ✅ Data updates for each time range
- ✅ Charts refresh correctly
- ✅ Metrics recalculated
- ✅ No data loss between switches

---

## 7. Edge Cases & Error Handling

### Test Case 7.1: Network Disconnection
**Steps:**
1. Disconnect internet
2. Try to create commitment
3. Reconnect internet

**Expected Result:**
- ✅ Error message displayed
- ✅ Data not lost locally
- ✅ Retry option available
- ✅ Syncs when reconnected

### Test Case 7.2: Concurrent Updates
**Steps:**
1. Open app in two browser tabs
2. Update same commitment in both tabs
3. Check final state

**Expected Result:**
- ✅ Both tabs receive updates
- ✅ Real-time sync works
- ✅ No data corruption
- ✅ Last write wins or merge logic applied

### Test Case 7.3: Large Data Sets
**Test Data:**
```
Create:
- 50 weekly commitments (historical)
- 100 study sessions
- 200 quiz attempts
```

**Expected Result:**
- ✅ UI remains responsive
- ✅ Pagination/limits applied
- ✅ Load times acceptable (<3s)
- ✅ No browser crashes

### Test Case 7.4: Invalid Data Handling
**Steps:**
1. Enter negative progress value
2. Enter target < current progress
3. Enter special characters in descriptions

**Expected Result:**
- ✅ Validation prevents invalid data
- ✅ Helpful error messages shown
- ✅ No database writes with bad data
- ✅ Form doesn't break

### Test Case 7.5: Permission Errors
**Steps:**
1. Check browser console for permission errors
2. Test with different user accounts
3. Verify security rules

**Expected Result:**
- ✅ No permission errors in console
- ✅ Users can only access own data
- ✅ Proper error messages for denied access
- ✅ All indexes built (no "index building" errors)

---

## 8. Performance Testing

### Test Case 8.1: Page Load Times
**Measure:**
- Dashboard: < 2 seconds
- Analytics: < 3 seconds
- Battle Drills: < 2 seconds
- Accountability: < 2 seconds

### Test Case 8.2: Database Query Performance
**Monitor:**
- Single commitment load: < 500ms
- Analytics aggregation: < 1.5s
- Progress tracking: < 800ms

### Test Case 8.3: Real-time Updates
**Steps:**
1. Update commitment in one tab
2. Measure time for update to appear in another tab

**Expected:** < 2 seconds for real-time sync

---

## 9. Mobile Responsiveness

### Test Case 9.1: Mobile View (375x667)
**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone SE or similar
4. Navigate through all pages

**Expected Result:**
- ✅ All content visible
- ✅ No horizontal scroll
- ✅ Buttons are tappable
- ✅ Forms are usable
- ✅ Cards stack vertically

### Test Case 9.2: Tablet View (768x1024)
**Expected Result:**
- ✅ Optimized layout for tablet
- ✅ Good use of screen space
- ✅ Touch-friendly interface

---

## 10. Browser Compatibility

### Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Safari (if available)

**Check for:**
- Visual consistency
- Feature parity
- Performance differences
- Console errors specific to browser

---

## 11. Firestore Data Verification

### Manual Checks:
1. **weeklyCommitments collection:**
   - Document structure matches schema
   - userId correctly set
   - Dates are Firestore Timestamps
   - Array of commitments is valid

2. **battleDrillPerformance collection:**
   - userId matches authenticated user
   - Timestamps are correct
   - Scores are within valid range

3. **resetTokens collection:**
   - Token usage logged
   - UsedAt timestamp set
   - ItemId references correct activity

4. **studySessions collection:**
   - Duration in seconds
   - Completed flag accurate
   - StartTime is Timestamp

---

## 12. Security Testing

### Test Case 12.1: Authentication Required
**Steps:**
1. Logout
2. Try to access dashboard URL directly
3. Try to access API endpoints

**Expected Result:**
- ✅ Redirected to login
- ✅ No data exposed
- ✅ Protected routes enforced

### Test Case 12.2: User Data Isolation
**Steps:**
1. Create data with User A
2. Login as User B
3. Try to access User A's data

**Expected Result:**
- ✅ User B sees only own data
- ✅ Firestore rules enforce isolation
- ✅ No cross-user data leakage

---

## Testing Checklist

### Pre-Testing:
- [ ] Clear browser cache
- [ ] Open developer console
- [ ] Check Firestore Rules are deployed
- [ ] Check all indexes are built (no "building" status)
- [ ] Ensure test user account exists

### During Testing:
- [ ] Monitor console for errors
- [ ] Check Network tab for failed requests
- [ ] Verify Firestore writes in Firebase Console
- [ ] Take screenshots of bugs
- [ ] Note reproduction steps

### Post-Testing:
- [ ] Clean up test data
- [ ] Document all bugs found
- [ ] Verify all critical paths work
- [ ] Check for any permission errors
- [ ] Confirm real-time updates work

---

## Sample Test Data Sets

### Minimal Test Set (Quick Smoke Test):
```json
{
  "user": "test@example.com",
  "commitments": 1,
  "sessions": 3,
  "drills": 2
}
```

### Standard Test Set (Full Feature Test):
```json
{
  "user": "test@example.com",
  "commitments": 5,
  "sessions": 10,
  "drills": 5,
  "quizAttempts": 8,
  "resetTokensUsed": 2
}
```

### Stress Test Set:
```json
{
  "user": "test@example.com",
  "commitments": 20,
  "sessions": 50,
  "drills": 30,
  "quizAttempts": 100
}
```

---

## Bug Reporting Template

```markdown
### Bug Title: [Short descriptive title]

**Priority:** High/Medium/Low
**Component:** [Feature name]
**Browser:** [Chrome 120 / Firefox 121 / etc.]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**

**Actual Result:**

**Console Errors:**
```
[paste console errors]
```

**Screenshots:**
[attach screenshots]

**Additional Context:**
```

---

## Success Criteria

✅ **All features work without errors**
✅ **No permission errors in console**
✅ **All Firestore indexes built**
✅ **Real-time updates function**
✅ **Data persists across sessions**
✅ **Mobile responsive on all pages**
✅ **Fast load times (< 3s)**
✅ **Security rules enforced**
✅ **No data loss on errors**
✅ **User-friendly error messages**

---

## Quick Regression Test (5 minutes)

1. ✅ Login
2. ✅ Create weekly commitment
3. ✅ Update commitment progress
4. ✅ Start battle drill
5. ✅ Complete battle drill
6. ✅ View analytics
7. ✅ Delete commitment
8. ✅ Logout
9. ✅ Login again (verify persistence)
10. ✅ Check console (no errors)

**If all pass:** ✅ App is stable for deployment
