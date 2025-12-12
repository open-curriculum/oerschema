# Testing Instructions for OER Schema Google Apps Script Add-on

## Quick Start Testing

### Option 1: Add-on Mode (Recommended)

1. **Create Apps Script Project**:
   - Go to script.google.com
   - Create new project
   - Copy the three files: `Code.js`, `sidebar.html`, `appsscript.json`

2. **Deploy as Test Add-on**:
   - Save project (Ctrl+S)
   - Click "Deploy" → "Test deployments" 
   - Click "Install add-on"
   - Choose "Add-on" type

3. **Test in Google Docs**:
   - Open any Google Doc
   - Go to Extensions menu
   - Look for "OER Schema Components"
   - Click to open sidebar

### Option 2: Standalone Script Mode (For Debugging)

1. **Create and Setup**:
   - Follow steps 1 from Option 1
   - DON'T deploy as add-on yet

2. **IMPORTANT - Get Document Context**:
   
   **Method A: Bound Script (Recommended)**
   - Open a Google Doc in a new tab
   - Go to Extensions → Apps Script
   - Replace code with your `Code.js` content
   - Add `sidebar.html` and `appsscript.json` files
   - Run functions directly from this editor
   
   **Method B: Standalone with Active Document**
   - Open a Google Doc in one browser tab
   - Keep your Apps Script editor in another tab
   - Run `bindToActiveDocument()` first
   - Then run other functions

3. **Test Individual Functions**:
   ```javascript
   // First, establish document connection
   bindToActiveDocument();  // or use Method A above
   
   // Check execution context
   checkContext();
   
   // Safe initialization (creates menu + opens sidebar)
   safeInit();
   
   // Or test components individually
   insertLearningObjective("Test Skill", "Test Course", "Test Description");
   ```

## Expected Behavior

### Successful Add-on Installation

- ✅ No error messages during deployment
- ✅ "OER Schema Components" appears in Extensions menu
- ✅ Clicking opens sidebar with forms
- ✅ Forms submit successfully and insert components
- ✅ Export creates HTML file in Google Drive

### Successful Standalone Testing

- ✅ `createMenu()` runs without errors
- ✅ Menu appears in document toolbar
- ✅ `testSidebar()` opens sidebar
- ✅ Component functions insert formatted content

## Troubleshooting Common Issues

### Issue: "Cannot call DocumentApp.getUi() from this context"

**Fixed in current version**, but if you still see this:

**IMMEDIATE FIX**: Use the new safe functions instead:

```javascript
// Step 1: Check what context you're in
checkContext();

// Step 2: If context looks good, try safe initialization  
safeInit();
```

**Root Cause**: This error happens when:
- Running `onOpen()`, `createMenu()`, or `testSidebar()` in restricted execution contexts
- The add-on framework calls functions before UI is available
- Trying to access DocumentApp.getUi() during initialization

**Solutions**:

1. **Check Context**: 
   - Are you running in add-on mode? Use `onHomepage()` trigger
   - Are you testing standalone? Use `checkContext()` then `safeInit()`

2. **Verify Manifest**:
   - Make sure `appsscript.json` has correct trigger functions
   - Check OAuth scopes are properly configured

### Issue: Add-on not in Extensions menu

1. **Deployment Check**:
   - Verify you created a "Test deployment"
   - Try refreshing the Google Doc

2. **Fallback Testing**:
   - Use standalone mode instead
   - Run `checkContext()` to diagnose issues
   - Run `safeInit()` to create manual menu

### Issue: Sidebar won't open

1. **Check HTML File**:
   - Ensure `sidebar.html` is uploaded correctly
   - Check for syntax errors in HTML

2. **Test Alternative**:
   - Run individual insertion functions directly
   - Check execution transcript for errors

## Validation Steps

After installation, test each component:

1. **Learning Objective**:
   - Fill: Skill="Problem Solving", Course="CS 101", Description="Learn algorithms"
   - Should create formatted section with table

2. **Assessment**:
   - Fill: Type="Quiz", Points="25", Title="Midterm", Content="Questions about..."
   - Should create assessment section with metadata

3. **Practice Activity**:
   - Fill: Actions="Coding", Materials="Computer", Title="Calculator", Instructions="Build..."
   - Should create practice section

4. **Export**:
   - Click "Export to HTML"
   - Should create file in Google Drive with OER Schema markup

## Success Indicators

✅ **Full Success**: Add-on appears in Extensions menu and all functions work

✅ **Partial Success**: Standalone menu works, individual functions work

❌ **Needs Debug**: UI context errors, functions don't execute

## Next Steps After Testing

1. **If Working**: Test with real course content, consider marketplace publication
2. **If Partial**: Use standalone mode for now, debug add-on configuration
3. **If Broken**: Check troubleshooting guide, test individual functions

## File Checklist

Ensure you have these files in your Apps Script project:

- [ ] `Code.js` - Main functions (343 lines, includes UI error handling)
- [ ] `sidebar.html` - Interface (complete form with all component types)  
- [ ] `appsscript.json` - Manifest (27 lines, includes add-on config)

All files have been updated to handle the UI context issue properly.
