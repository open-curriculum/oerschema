/**
 * Google Apps Script for OER Schema Components Add-on
 * Adds pedagogical components to Google Docs with proper formatting
 */

/**
 * Called when the add-on is installed
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Called when a document is opened
 * For add-ons, this should be minimal and not access UI directly
 */
function onOpen(e) {
  // For add-ons, onOpen should not create menus or access UI
  // The menu is created automatically from the manifest
  try {
    console.log('Add-on loaded, context:', typeof e);
    
    // Only try to create menu if we're in a normal document context
    // and NOT in an add-on context
    if (e && e.source && !e.addOn) {
      // This is a regular script, not an add-on
      tryCreateMenu();
    }
  } catch (error) {
    console.log('onOpen completed with limited context');
  }
}

/**
 * Safely try to create menu only in appropriate contexts
 */
function tryCreateMenu() {
  try {
    // Additional check: make sure we can access the document
    const doc = DocumentApp.getActiveDocument();
    if (!doc) {
      console.log('No active document, skipping menu creation');
      return;
    }
    
    const ui = DocumentApp.getUi();
    ui.createMenu('OER Schema Components')
      .addItem('Open Components Sidebar', 'showSidebar')
      .addToUi();
    console.log('Menu created successfully');
  } catch (error) {
    console.log('Could not create menu (restricted context):', error.toString());
  }
}

/**
 * Called when the add-on is opened from the Extensions menu
 * This is triggered by the homepageTrigger in the manifest
 */
function onHomepage(e) {
  return showSidebar();
}

/**
 * Called when file scope is granted
 */
function onFileScopeGranted(e) {
  return showSidebar();
}

/**
 * Opens the add-on sidebar
 */
function showSidebar() {
  try {
    const htmlTemplate = HtmlService.createTemplateFromFile('sidebar');
    const htmlOutput = htmlTemplate
      .evaluate()
      .setTitle('OER Schema Components')
      .setWidth(350);
    
    // Check if we're in an add-on context
    if (typeof DocumentApp !== 'undefined' && DocumentApp.getUi) {
      DocumentApp.getUi().showSidebar(htmlOutput);
      console.log('Sidebar opened successfully');
      return null; // For regular script execution
    } else {
      // Return HTML output for add-on context
      return htmlOutput;
    }
  } catch (error) {
    console.error('Error opening sidebar:', error);
    
    // Try to show alert if possible
    try {
      if (typeof DocumentApp !== 'undefined' && DocumentApp.getUi) {
        DocumentApp.getUi().alert('Error opening sidebar: ' + error.toString());
      }
    } catch (alertError) {
      console.error('Could not show alert:', alertError);
    }
    
    // Return error message for add-on context
    return HtmlService.createHtmlOutput('<p>Error loading components: ' + error.toString() + '</p>');
  }
}

/**
 * Test function - run this manually to test sidebar
 * Also creates menu for standalone script mode
 */
function testSidebar() {
  console.log('Testing sidebar...');
  
  // Try to create menu for standalone script only if safe
  try {
    // Check if we have document access first
    const doc = DocumentApp.getActiveDocument();
    if (doc) {
      const ui = DocumentApp.getUi();
      ui.createMenu('OER Schema Components')
        .addItem('Open Components Sidebar', 'showSidebar')
        .addToUi();
      console.log('Menu created for standalone script');
    } else {
      console.log('No active document for menu creation');
    }
  } catch (error) {
    console.log('Cannot create menu in this context:', error.toString());
  }
  
  // Try to show sidebar
  try {
    showSidebar();
  } catch (error) {
    console.log('Cannot show sidebar in this context:', error.toString());
  }
}

/**
 * Alternative function to create menu manually for testing
 * Only use this in standalone script mode
 */
function createMenu() {
  try {
    // Check if we have proper context first
    const doc = DocumentApp.getActiveDocument();
    if (!doc) {
      console.log('No active document available');
      return;
    }
    
    const ui = DocumentApp.getUi();
    ui.createMenu('OER Schema Components')
      .addItem('Open Components Sidebar', 'showSidebar')
      .addToUi();
    console.log('Menu created successfully');
  } catch (error) {
    console.log('Cannot create menu in this context:', error.toString());
  }
}

/**
 * Include external files in HTML templates
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Helper function to get safe insertion position in document
 */
function getInsertionIndex(doc) {
  const body = doc.getBody();
  const cursor = doc.getCursor();
  
  if (cursor) {
    try {
      // Get the element containing the cursor
      const element = cursor.getElement();
      const parentElement = element.getParent();
      
      // If the element is directly in the body, use its index
      if (parentElement === body) {
        return body.getChildIndex(element) + 1;
      } else {
        // If it's nested (like in a table), find the top-level parent
        let topLevelElement = element;
        while (topLevelElement.getParent() !== body) {
          topLevelElement = topLevelElement.getParent();
        }
        return body.getChildIndex(topLevelElement) + 1;
      }
    } catch (error) {
      console.log('Error getting cursor position:', error.toString());
      // Fallback to end of document
      return body.getNumChildren();
    }
  } else {
    // No cursor, insert at end
    return body.getNumChildren();
  }
}

/**
 * Insert a Learning Objective component
 */
function insertLearningObjective(skill, course, description) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Get safe insertion position
  const insertIndex = getInsertionIndex(doc);
  
  // Create heading
  const heading = body.insertParagraph(insertIndex, '🎯 Learning Objective');
  heading.setHeading(DocumentApp.ParagraphHeading.HEADING3);
  heading.editAsText().setBold(true);
  
  // Add description
  const descParagraph = body.insertParagraph(insertIndex + 1, description);
  descParagraph.editAsText().setItalic(true);
  
  // Add metadata
  const metaTable = body.insertTable(insertIndex + 2);
  const metaRow = metaTable.appendTableRow();
  metaRow.appendTableCell('Skill: ' + skill);
  metaRow.appendTableCell('Course: ' + course);
  
  // Style the table
  metaTable.setBorderWidth(1);
  metaTable.setAttributes({
    [DocumentApp.Attribute.BACKGROUND_COLOR]: '#f0f9ff',
    [DocumentApp.Attribute.MARGIN_LEFT]: 20
  });
  
  // Add hidden metadata for export
  const hiddenPara = body.insertParagraph(insertIndex + 3, '');
  hiddenPara.editAsText()
    .setAttributes({
      [DocumentApp.Attribute.FOREGROUND_COLOR]: '#ffffff',
      [DocumentApp.Attribute.FONT_SIZE]: 1
    })
    .setText(`[OER-SCHEMA:LearningObjective:skill="${skill}":course="${course}"]`);
  
  // Show alert if UI is available
  try {
    DocumentApp.getUi().alert('Learning Objective inserted successfully!');
  } catch (error) {
    console.log('Learning Objective inserted successfully (no UI alert available)');
  }
}

/**
 * Insert an Assessment component
 */
function insertAssessment(type, points, title, content) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Get safe insertion position
  const insertIndex = getInsertionIndex(doc);
  
  // Create heading
  const heading = body.insertParagraph(insertIndex, '📝 Assessment: ' + title);
  heading.setHeading(DocumentApp.ParagraphHeading.HEADING3);
  heading.editAsText().setBold(true);
  
  // Add content
  const contentParagraph = body.insertParagraph(insertIndex + 1, content);
  
  // Add metadata table
  const metaTable = body.insertTable(insertIndex + 2);
  const metaRow = metaTable.appendTableRow();
  metaRow.appendTableCell('Type: ' + type);
  metaRow.appendTableCell('Points: ' + points);
  
  // Style the table
  metaTable.setBorderWidth(1);
  metaTable.setAttributes({
    [DocumentApp.Attribute.BACKGROUND_COLOR]: '#fffbeb',
    [DocumentApp.Attribute.MARGIN_LEFT]: 20
  });
  
  // Add hidden metadata
  const hiddenPara = body.insertParagraph(insertIndex + 3, '');
  hiddenPara.editAsText()
    .setAttributes({
      [DocumentApp.Attribute.FOREGROUND_COLOR]: '#ffffff',
      [DocumentApp.Attribute.FONT_SIZE]: 1
    })
    .setText(`[OER-SCHEMA:Assessment:type="${type}":points="${points}":title="${title}"]`);
  
  // Show alert if UI is available
  try {
    DocumentApp.getUi().alert('Assessment inserted successfully!');
  } catch (error) {
    console.log('Assessment inserted successfully (no UI alert available)');
  }
}

/**
 * Insert a Practice Activity component
 */
function insertPractice(actions, materials, title, instructions) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Get insertion position
  let insertIndex;
  const cursor = doc.getCursor();
  if (cursor) {
    // Get the element containing the cursor
    const element = cursor.getElement();
    insertIndex = body.getChildIndex(element) + 1;
  } else {
    // No cursor, insert at end
    insertIndex = body.getNumChildren();
  }
  
  // Create heading
  const heading = body.insertParagraph(insertIndex, '🔬 Practice: ' + title);
  heading.setHeading(DocumentApp.ParagraphHeading.HEADING3);
  heading.editAsText().setBold(true);
  
  // Add instructions
  const instructionsParagraph = body.insertParagraph(insertIndex + 1, instructions);
  
  // Add metadata table
  const metaTable = body.insertTable(insertIndex + 2);
  const actionsRow = metaTable.appendTableRow();
  actionsRow.appendTableCell('Actions: ' + actions);
  const materialsRow = metaTable.appendTableRow();
  materialsRow.appendTableCell('Materials: ' + materials);
  
  // Style the table
  metaTable.setBorderWidth(1);
  metaTable.setAttributes({
    [DocumentApp.Attribute.BACKGROUND_COLOR]: '#f0fdf4',
    [DocumentApp.Attribute.MARGIN_LEFT]: 20
  });
  
  // Add hidden metadata
  const hiddenPara = body.insertParagraph(insertIndex + 3, '');
  hiddenPara.editAsText()
    .setAttributes({
      [DocumentApp.Attribute.FOREGROUND_COLOR]: '#ffffff',
      [DocumentApp.Attribute.FONT_SIZE]: 1
    })
    .setText(`[OER-SCHEMA:Practice:actions="${actions}":materials="${materials}":title="${title}"]`);
  
  // Show alert if UI is available
  try {
    DocumentApp.getUi().alert('Practice Activity inserted successfully!');
  } catch (error) {
    console.log('Practice Activity inserted successfully (no UI alert available)');
  }
}

/**
 * Export document with OER Schema metadata to HTML
 */
function exportToHTML() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const text = body.getText();
  
  // Extract OER Schema metadata
  const metadataRegex = /\[OER-SCHEMA:([^:]+):([^\]]+)\]/g;
  const metadata = [];
  let match;
  
  while ((match = metadataRegex.exec(text)) !== null) {
    const type = match[1];
    const attrs = match[2];
    metadata.push({ type, attrs });
  }
  
  // Generate HTML with microdata
  let html = `<!DOCTYPE html>
<html>
<head>
  <title>${doc.getName()}</title>
  <meta charset="utf-8">
  <style>
    .oer-component { margin: 20px 0; padding: 15px; border-radius: 5px; }
    .oer-learning-objective { background: #f0f9ff; border-left: 4px solid #3b82f6; }
    .oer-assessment { background: #fffbeb; border-left: 4px solid #f59e0b; }
    .oer-practice { background: #f0fdf4; border-left: 4px solid #10b981; }
  </style>
</head>
<body>`;
  
  // Process document content and add microdata
  const paragraphs = body.getParagraphs();
  
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    const paraText = para.getText();
    
    // Check if this paragraph contains OER Schema metadata
    const metaMatch = paraText.match(/\[OER-SCHEMA:([^:]+):([^\]]+)\]/);
    
    if (metaMatch) {
      // Skip hidden metadata paragraphs
      continue;
    }
    
    // Check if this is a component heading
    if (paraText.includes('🎯 Learning Objective')) {
      html += `<div class="oer-component oer-learning-objective" itemscope itemtype="http://oerschema.org/LearningObjective">`;
      html += `<h3>${paraText}</h3>`;
      // Add description from next paragraph
      if (i + 1 < paragraphs.length) {
        html += `<p itemprop="description">${paragraphs[i + 1].getText()}</p>`;
        i++; // Skip next paragraph since we've processed it
      }
      html += `</div>`;
    } else if (paraText.includes('📝 Assessment')) {
      html += `<div class="oer-component oer-assessment" itemscope itemtype="http://oerschema.org/Assessment">`;
      html += `<h3>${paraText}</h3>`;
      if (i + 1 < paragraphs.length) {
        html += `<div>${paragraphs[i + 1].getText()}</div>`;
        i++;
      }
      html += `</div>`;
    } else if (paraText.includes('🔬 Practice')) {
      html += `<div class="oer-component oer-practice" itemscope itemtype="http://oerschema.org/Practice">`;
      html += `<h3>${paraText}</h3>`;
      if (i + 1 < paragraphs.length) {
        html += `<div>${paragraphs[i + 1].getText()}</div>`;
        i++;
      }
      html += `</div>`;
    } else if (paraText.trim() !== '') {
      html += `<p>${paraText}</p>`;
    }
  }
  
  html += `</body></html>`;
  
  // Create and save HTML file to Drive
  const htmlBlob = Utilities.newBlob(html, 'text/html', doc.getName() + '_with_oer_schema.html');
  const file = DriveApp.createFile(htmlBlob);
  
  // Show alert if UI is available
  try {
    DocumentApp.getUi().alert(`HTML file created: ${file.getUrl()}`);
  } catch (error) {
    console.log(`HTML file created: ${file.getUrl()} (no UI alert available)`);
  }
  
  return html;
}

/**
 * Safe initialization function for testing
 * Call this manually when you want to test the add-on
 */
function safeInit() {
  console.log('Safe initialization starting...');
  
  // Check execution context
  try {
    const doc = DocumentApp.getActiveDocument();
    console.log('Document available:', !!doc);
    
    if (doc) {
      console.log('Document name:', doc.getName());
      
      // Try to access UI
      try {
        const ui = DocumentApp.getUi();
        console.log('UI available:', !!ui);
        
        // Create menu if everything looks good
        ui.createMenu('OER Schema Components')
          .addItem('Open Components Sidebar', 'showSidebar')
          .addToUi();
        console.log('✅ Menu created successfully');
        
        // Try to open sidebar
        showSidebar();
        
      } catch (uiError) {
        console.log('❌ UI not available:', uiError.toString());
      }
    } else {
      console.log('❌ No active document');
    }
  } catch (error) {
    console.log('❌ Document access failed:', error.toString());
  }
  
  console.log('Safe initialization completed');
}

/**
 * Minimal test that just logs context information
 */
function checkContext() {
  console.log('=== Context Check ===');
  console.log('DocumentApp available:', typeof DocumentApp !== 'undefined');
  
  try {
    const doc = DocumentApp.getActiveDocument();
    console.log('Active document available:', !!doc);
    if (doc) {
      console.log('Document name:', doc.getName());
    }
  } catch (error) {
    console.log('Document access error:', error.toString());
  }
  
  try {
    const ui = DocumentApp.getUi();
    console.log('UI available:', !!ui);
  } catch (error) {
    console.log('UI access error:', error.toString());
  }
  
  console.log('=== End Context Check ===');
}

/**
 * Bind to currently active document - use this for standalone testing
 * Run this while you have a Google Doc open in another browser tab
 */
function bindToActiveDocument() {
  try {
    // This will work if called while a Google Doc is active in another tab
    const doc = DocumentApp.getActiveDocument();
    console.log('✅ Found document:', doc.getName());
    console.log('Document ID:', doc.getId());
    console.log('Document URL:', doc.getUrl());
    
    // Now create the menu
    const ui = DocumentApp.getUi();
    ui.createMenu('OER Schema Components')
      .addItem('Open Components Sidebar', 'showSidebar')
      .addToUi();
    
    console.log('✅ Successfully bound to document and created menu');
    console.log('💡 Go back to your Google Doc to see the menu');
    return true;
  } catch (error) {
    console.log('❌ No active document found:', error.toString());
    console.log('💡 SOLUTION: Open a Google Doc in another browser tab first');
    console.log('💡 OR: Use Extensions → Apps Script from within a Google Doc');
    return false;
  }
}

/**
 * Create a new test document for OER Schema components
 */
function createTestDocument() {
  try {
    const doc = DocumentApp.create('OER Schema Components - Test Document');
    console.log('✅ Created new document:', doc.getName());
    console.log('📄 Document URL:', doc.getUrl());
    
    // Add some initial content
    const body = doc.getBody();
    body.appendParagraph('OER Schema Components Test Document').setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph('This document is for testing OER Schema components.');
    body.appendParagraph('Use the Extensions menu or the OER Schema Components menu to insert pedagogical components.');
    body.appendParagraph('');
    body.appendParagraph('Available components:');
    body.appendParagraph('• Learning Objectives');
    body.appendParagraph('• Assessments');
    body.appendParagraph('• Practice Activities');
    body.appendParagraph('');
    body.appendParagraph('Test content will be inserted below this line:');
    body.appendHorizontalRule();
    
    console.log('💡 Open this document URL and then run bindToActiveDocument()');
    return doc;
  } catch (error) {
    console.log('❌ Could not create document:', error.toString());
    return null;
  }
}
