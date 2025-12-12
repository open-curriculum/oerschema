# Google Workspace Add-on: OER Schema Components

This Google Apps Script project creates a Google Docs add-on that allows educators to insert pedagogical components with OER Schema metadata.

## Features

### 🎯 Learning Objectives
- Insert formatted learning objectives with skill and course metadata
- Automatic OER Schema microdata embedding
- Visual formatting with icons and colors

### 📝 Assessments  
- Create quizzes, exams, and evaluation components
- Track points and assessment types
- Export with proper schema markup

### 🔬 Practice Activities
- Add hands-on learning exercises
- Specify action types (Observing, Making, etc.)
- Include materials and instructions

### 📤 Export Functionality
- Export documents to HTML with embedded OER Schema microdata
- Automatic file creation in Google Drive
- Preserves formatting and semantic structure

## Installation

### Method 1: Deploy as Personal Add-on

1. **Create New Google Apps Script Project**
   - Go to [script.google.com](https://script.google.com)
   - Click "New Project"
   - Replace default code with files from this directory

2. **Add Files**
   - `Code.js` - Main script functions
   - `sidebar.html` - User interface
   - `appsscript.json` - Project configuration

3. **Deploy**
   - Click "Deploy" → "New Deployment"
   - Select type: "Add-on"
   - Click "Deploy"

4. **Install in Google Docs**
   - Open any Google Doc
   - Extensions → Apps Script → Run "onInstall"
   - Grant permissions when prompted

### Method 2: Publish to Google Workspace Marketplace

1. **Prepare for Publication**
   - Complete Google Cloud Console setup
   - Add OAuth consent screen
   - Create store listing with screenshots

2. **Submit for Review**
   - Google reviews add-ons before public release
   - Process typically takes 1-2 weeks

## Usage

1. **Open Google Docs**
   - The add-on appears in Extensions menu

2. **Insert Components**
   - Click "OER Schema Components" in sidebar
   - Choose component type
   - Fill in form fields
   - Click "Insert"

3. **Export with Schema**
   - Click "Export to HTML with OER Schema"
   - HTML file is saved to your Google Drive
   - Includes proper microdata markup

## Technical Architecture

### Google Apps Script Platform
- **Server-side JavaScript** for document manipulation
- **HTML/CSS/JS** for user interface
- **Google APIs** for Drive integration

### OER Schema Integration
- **Hidden metadata** embedded in document
- **Export processing** extracts and converts to HTML microdata
- **Visual formatting** maintains readability

### Security & Privacy
- **Document-scoped permissions** (no access to other docs)
- **Drive file creation** only for exports
- **No external data transmission**

## Example Output

When exported, components generate HTML like:

```html
<div class="oer-component oer-learning-objective" 
     itemscope itemtype="http://oerschema.org/LearningObjective">
  <meta itemprop="skill" content="analyze data" />
  <meta itemprop="forCourse" content="STAT-101" />
  <h3>🎯 Learning Objective</h3>
  <p itemprop="description">Students will be able to analyze statistical data...</p>
</div>
```

## Future Enhancements

- **Google Classroom integration** for assignment templates
- **Google Sites support** for course websites  
- **Collaborative editing** with real-time schema validation
- **Template library** with pre-built pedagogical patterns
- **Canvas LMS export** for direct import to learning management systems

## Distribution Strategy

### Phase 1: Self-Hosted Development
- Deploy as personal add-on for testing
- Gather feedback from early adopters
- Refine functionality and UI

### Phase 2: Limited Release
- Share with educator communities
- Beta testing with select institutions
- Documentation and support materials

### Phase 3: Public Marketplace
- Submit to Google Workspace Marketplace
- SEO optimization and marketing
- Integration with OER Schema ecosystem

This Google Workspace add-on bridges the gap between where educators create content (Google Docs) and where they need semantic structure (web publishing platforms).

## Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot call DocumentApp.getUi() from this context" Error

**Problem**: This error occurs when the script tries to access the UI in an execution context that doesn't support it.

**Solution**: The code has been updated to handle this properly with try-catch blocks. If you still see this error:

1. **For Add-on Mode**:
   - Make sure you're using the correct trigger functions (`onHomepage`, `onFileScopeGranted`)
   - The `onOpen` function should not directly access UI in add-on mode

2. **For Standalone Testing**:
   - Run `createMenu()` function manually from the script editor
   - Use `testSidebar()` to test the sidebar directly

#### 2. Add-on Not Appearing in Extensions Menu

**Possible Causes**:
- Add-on not properly deployed as test deployment
- Manifest configuration issues
- Permission problems

**Solutions**:
1. **Check Deployment**:
   - Go to script.google.com → your project
   - Click "Deploy" → "Test deployments"
   - Make sure you have an active test deployment

2. **Verify Manifest**:
   - Ensure `appsscript.json` includes the add-on configuration
   - Check that OAuth scopes are correct

3. **Alternative Testing**:
   ```javascript
   // Run these manually in script editor:
   createMenu();     // Creates menu in current doc
   testSidebar();    // Opens sidebar directly
   ```

#### 3. Sidebar Not Loading

**Check these items**:
- HTML file `sidebar.html` is properly uploaded
- No syntax errors in HTML/JavaScript
- All functions are properly defined in Code.js

**Debug steps**:
1. Check execution transcript in Apps Script editor
2. Look for JavaScript errors in browser console
3. Test individual functions:
   ```javascript
   // Test component insertion directly
   insertLearningObjective("test skill", "test course", "test description");
   ```

#### 4. Components Not Inserting Properly

**Common issues**:
- Document not properly accessed
- Cursor position errors
- Formatting problems

**Solutions**:
1. **Ensure Document Access**:
   - Make sure the script has permission to edit the document
   - Check that you're running from an open Google Doc

2. **Test Individual Functions**:
   ```javascript
   // Test each component type
   insertAssessment("Quiz", "10", "Test Quiz", "Sample question");
   insertPractice("Coding", "Computer", "Build App", "Create a simple app");
   ```

### Testing Workflow

#### For Development and Testing

1. **Initial Setup**:
   ```javascript
   // Run once to set up menu
   createMenu();
   ```

2. **Test Sidebar**:
   ```javascript
   // Test sidebar loading
   testSidebar();
   ```

3. **Test Components**:
   ```javascript
   // Test each component type individually
   insertLearningObjective("Problem Solving", "CS 101", "Learn to solve problems");
   insertAssessment("Quiz", "25", "Midterm", "Complete the quiz");
   insertPractice("Coding", "IDE", "Calculator", "Build calculator app");
   ```

4. **Test Export**:
   ```javascript
   // Test HTML export
   exportToHTML();
   ```

#### For Add-on Deployment

1. **Deploy as Test**:
   - Apps Script → Deploy → New Deployment → Add-on
   - Copy deployment ID

2. **Install in Google Doc**:
   - Open Google Doc → Extensions → Apps Script → {Your Project}
   - Or use the deployment link

3. **Grant Permissions**:
   - Follow OAuth flow to grant document access
   - Check that all required scopes are approved

### Debug Mode Functions

The following functions are available for debugging:

```javascript
// Create menu manually (for standalone mode)
createMenu();

// Test sidebar without add-on framework
testSidebar();

// Test component insertion
insertLearningObjective("debug", "debug", "debug test");

// Test export functionality
exportToHTML();
```

### Performance Tips

- **Large Documents**: The export function processes all paragraphs - may be slow for very large documents
- **Multiple Components**: Insert components one at a time for better reliability
- **Browser Compatibility**: Works best in Chrome/Edge for Google Docs integration

### Getting Help

If you continue to experience issues:

1. **Check the execution transcript** in Apps Script editor for detailed error messages
2. **Test in incognito mode** to rule out browser extension conflicts
3. **Try with a fresh Google Doc** to eliminate document-specific issues
4. **Run individual functions** to isolate the problem area
