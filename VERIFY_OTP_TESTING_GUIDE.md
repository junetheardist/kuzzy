# Email Verification - Testing Guide

## Quick Testing Checklist

### Test 1: Empty OTP
1. Go to `/verify-otp` page
2. Leave OTP field empty
3. Click "Verify" button
4. **Expected:** Button shows error "Please enter the OTP"
5. **Status:** ✅ Pass / ❌ Fail

---

### Test 2: Non-Digit Characters
1. In OTP field, try typing: `ABC123!@#`
2. **Expected:** Only digits are accepted (shows `123`)
3. **Status:** ✅ Pass / ❌ Fail

---

### Test 3: Invalid OTP Length
1. Enter `12345` (5 digits)
2. Click "Verify" button
3. **Expected:** Button shows error "OTP must be 6 digits"
4. **Status:** ✅ Pass / ❌ Fail

---

### Test 4: Invalid OTP Code
1. Enter valid 6-digit code but wrong number: `000000`
2. Click "Verify" button
3. **Expected:** Button disables, loading shows
4. Wait for response
5. **Expected:** Error displays "Invalid OTP" (from server)
6. **Status:** ✅ Pass / ❌ Fail

---

### Test 5: Valid OTP Code
1. Check email for correct OTP code
2. Enter the correct 6-digit code
3. Click "Verify" button
4. **Expected:** Button disables, shows "Verifying..."
5. Wait for response
6. **Expected:** Success message shows "Email verified successfully"
7. **Expected:** Redirects to `/login` page
8. **Status:** ✅ Pass / ❌ Fail

---

### Test 6: Expired OTP
1. Complete registration to get OTP
2. Wait 10+ minutes for OTP to expire
3. Go to verify-otp page
4. Enter the old OTP code
5. Click "Verify"
6. **Expected:** Error displays "OTP has expired"
7. **Status:** ✅ Pass / ❌ Fail

---

### Test 7: Resend OTP
1. On verify-otp page, click "Resend OTP" button
2. **Expected:** Button disables during request
3. Wait for response
4. **Expected:** Success message shows "OTP sent successfully"
5. **Expected:** Check email for new OTP code
6. **Expected:** Can use new OTP to verify
7. **Status:** ✅ Pass / ❌ Fail

---

### Test 8: Email Display
1. Go to verify-otp page after registration
2. **Expected:** Page displays message:
   ```
   A verification code has been sent to
   [your-email@example.com]
   ```
3. **Expected:** Email shown is correct
4. **Status:** ✅ Pass / ❌ Fail

---

### Test 9: Error Clearing
1. Enter `12345` (5 digits)
2. **Expected:** See error "OTP must be 6 digits"
3. Type `6` to make it `123456`
4. **Expected:** Error message disappears
5. **Status:** ✅ Pass / ❌ Fail

---

### Test 10: Enter Key Submission
1. On verify-otp page, enter valid 6-digit OTP
2. Press Enter key (not mouse click)
3. **Expected:** Form submits like button click
4. **Expected:** Shows "Verifying..." state
5. **Expected:** Appropriate success/error message
6. **Status:** ✅ Pass / ❌ Fail

---

### Test 11: Button State - Disabled When Empty
1. Page loads
2. **Expected:** "Verify" button is disabled (faded)
3. Type any character in OTP field
4. Continue typing until you have 6 digits
5. **Expected:** Button becomes enabled (full opacity)
6. Delete one digit (now 5 digits)
7. **Expected:** Button becomes disabled again
8. **Status:** ✅ Pass / ❌ Fail

---

### Test 12: Loading State
1. Enter valid 6-digit OTP
2. Click "Verify"
3. **Expected:** Button text changes to "Verifying..."
4. **Expected:** Button is disabled
5. **Expected:** Input field is disabled
6. Wait for response
7. **Expected:** Button returns to normal state
8. **Status:** ✅ Pass / ❌ Fail

---

### Test 13: Mobile Responsiveness
1. Open `/verify-otp` on mobile device (or browser dev tools)
2. **Expected:** Form is centered
3. **Expected:** All elements readable (not too small)
4. **Expected:** Input field easy to tap
5. **Expected:** Button easy to tap
6. **Expected:** Error messages visible
7. **Expected:** Layout doesn't break
8. **Status:** ✅ Pass / ❌ Fail

---

### Test 14: Multiple Failed Attempts
1. Enter wrong OTP: `111111`
2. Click verify
3. See error: "Invalid OTP"
4. Enter another wrong OTP: `222222`
5. Click verify
6. See error: "Invalid OTP"
7. Enter correct OTP: `[correct code]`
8. Click verify
9. **Expected:** Success and redirect to login
10. **Status:** ✅ Pass / ❌ Fail

---

### Test 15: Browser Console Check
1. Open DevTools (F12)
2. Go to Console tab
3. Go to `/verify-otp` page
4. Click "Verify" with empty OTP
5. **Expected:** No errors in console
6. Enter invalid OTP and verify
7. **Expected:** No unhandled promise rejections
8. **Expected:** Error logged if development mode
9. **Status:** ✅ Pass / ❌ Fail

---

## Edge Cases

### Edge Case 1: Rapid Clicks
1. Enter valid OTP
2. Rapidly click "Verify" button 5 times
3. **Expected:** Only one request sent (button disabled after first click)
4. **Status:** ✅ Pass / ❌ Fail

---

### Edge Case 2: Copy-Paste
1. Copy 6-digit OTP from email
2. Paste into OTP field
3. **Expected:** OTP field populated correctly
4. Click "Verify"
5. **Expected:** Works normally
6. **Status:** ✅ Pass / ❌ Fail

---

### Edge Case 3: Paste Non-Numeric
1. Copy text with letters: `ABC123DEF`
2. Try to paste in OTP field
3. **Expected:** Only `123` is pasted (numbers only)
4. **Status:** ✅ Pass / ❌ Fail

---

### Edge Case 4: Special Characters Paste
1. Copy `123456!@#` to clipboard
2. Paste in OTP field
3. **Expected:** Only `123456` is pasted
4. **Status:** ✅ Pass / ❌ Fail

---

### Edge Case 5: Network Slow
1. Open DevTools Network tab
2. Throttle to slow network (Slow 3G)
3. Enter valid OTP and click verify
4. **Expected:** Button still shows "Verifying..."
5. **Expected:** Can see loading state
6. Wait for response
7. **Expected:** Eventually succeeds or shows error
8. **Status:** ✅ Pass / ❌ Fail

---

## Success Criteria

All tests should pass:
- ✅ Empty OTP validation
- ✅ Character filtering (digits only)
- ✅ Length validation (6 digits)
- ✅ Invalid OTP error handling
- ✅ Valid OTP redirect to login
- ✅ Expired OTP error
- ✅ Resend OTP functionality
- ✅ Email display confirmation
- ✅ Error clearing on input
- ✅ Enter key submission
- ✅ Button state management
- ✅ Loading state feedback
- ✅ Mobile responsive
- ✅ Multiple attempt handling
- ✅ No console errors

---

## Regression Testing

After any changes to auth system, re-run all tests to ensure:
- [ ] Login still works
- [ ] Registration still works
- [ ] OTP verification doesn't break
- [ ] Error messages display correctly
- [ ] Redirects work properly
- [ ] No new console errors
- [ ] Performance acceptable

---

## Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Performance Notes

- OTP input filtering is real-time (no lag)
- API response should be < 2 seconds
- Page load should be < 1 second
- No memory leaks on repeated verification attempts

---

## Notes for QA

1. Collect test OTPs from email for manual testing
2. Document any failing test cases with screenshots
3. Report inconsistencies between browsers
4. Check server logs for any errors during testing
5. Monitor performance metrics

---

## Deployment Checklist

Before deploying to production:
- [ ] All 15+ tests pass
- [ ] No console errors
- [ ] Cross-browser testing complete
- [ ] Mobile testing complete
- [ ] Edge cases tested
- [ ] Performance acceptable
- [ ] Error messages user-friendly
- [ ] Email delivery working
- [ ] OTP expiration working (10 min)
- [ ] Database updates correctly

---

## Troubleshooting

### Issue: "Nothing happens when I click verify"
- Check browser console for errors
- Check if OTP is exactly 6 digits
- Check if email exists in database
- Verify Redux state updated
- Check network tab in DevTools

### Issue: Error doesn't clear
- Refresh page
- Check if `handleOtpChange` is called on input
- Verify input field connected to state

### Issue: Can't resend OTP
- Check if email parameter passed correctly
- Check resend-otp API endpoint
- Check email service credentials

### Issue: Not redirecting to login
- Check if token generated successfully
- Verify router.push() works
- Check if verifyOtp.fulfilled reducer updates properly

---

## Success Message

If all tests pass, the email verification flow is **production ready**! ✅
