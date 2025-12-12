# Quick Fix: Getting Active Document Context

## The Problem
You're seeing: `Cannot call DocumentApp.getUi() from this context`

**Root Cause**: Google Apps Script needs to run from within a Google Docs context to access documents and UI.

## Solution: Choose Your Method

### 🥇 Method 1: Bound Script (Easiest)

1. **Open any Google Doc** (or create a new one)
2. **Go to Extensions → Apps Script** 
3. **Replace the default code** with your `Code.js` content
4. **Add your HTML file**: Click "+" → "HTML file" → name it "sidebar" → paste `sidebar.html`
5. **Add your manifest**: Click "+" → "JSON file" → name it "appsscript" → paste `appsscript.json`
6. **Save** (Ctrl+S)
7. **Run any function** - now you have document context!

✅ **This is the most reliable method for testing**

### 🥈 Method 2: Standalone Script + Active Document

If you already have a standalone Apps Script project:

1. **Create a test document first**:
   ```javascript
   // Run this in your Apps Script editor
   createTestDocument();
   ```
   
2. **Copy the document URL** from the log output

3. **Open that document** in a new browser tab

4. **Back in Apps Script editor, run**:
   ```javascript
   bindToActiveDocument();
   ```

5. **Check the Google Doc** - you should now see "OER Schema Components" in the menu

### 🥉 Method 3: Add-on Deployment

For the full add-on experience:

1. **Complete your standalone script** first
2. **Deploy → Test deployments → Add-on**
3. **Install add-on** in a Google Doc
4. **Access via Extensions menu**

## Quick Test Commands

Once you have document context, test with these safe commands:

```javascript
// Check if everything is working
checkContext();

// Create menu and open sidebar
safeInit();

// Test component insertion
insertLearningObjective("Test Skill", "Test Course", "Students will learn X");

// Test export
exportToHTML();
```

## Troubleshooting

### ❌ Still getting UI errors?

**Check these:**
1. Are you running from the right script editor?
   - ✅ From Extensions → Apps Script (within a Google Doc)
   - ❌ From script.google.com (standalone, without document context)

2. Is the document actually open?
   - Run `checkContext()` to verify

3. Are you using the safe functions?
   - Use `safeInit()` instead of `createMenu()`
   - Use `bindToActiveDocument()` for standalone scripts

### 💡 Pro Tips

- **Always test with `checkContext()` first**
- **Use `safeInit()` for menu creation**
- **Keep your Google Doc tab open** while testing
- **The bound script method is most reliable** for development

## Expected Success Output

When everything works, you should see:

```
✅ Found document: [Document Name]
✅ UI available: true
✅ Menu created successfully
✅ Sidebar opened successfully
```

## Next Steps

Once you have document context working:
1. Test all component types
2. Test export functionality  
3. Deploy as add-on for real use
4. Share with other educators
