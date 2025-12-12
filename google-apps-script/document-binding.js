/**
 * Alternative approach - bind to currently open document
 * Run this function while you have a Google Doc open in another tab
 */
function bindToActiveDocument() {
  try {
    // This will work if called while a Google Doc is active in another tab
    const doc = DocumentApp.getActiveDocument();
    console.log('Found document:', doc.getName());
    
    // Now create the menu
    const ui = DocumentApp.getUi();
    ui.createMenu('OER Schema Components')
      .addItem('Open Components Sidebar', 'showSidebar')
      .addToUi();
    
    console.log('✅ Successfully bound to document and created menu');
    return true;
  } catch (error) {
    console.log('❌ No active document found:', error.toString());
    console.log('💡 Make sure you have a Google Doc open in another browser tab');
    return false;
  }
}

/**
 * Get document by ID if you know the specific document
 */
function bindToSpecificDocument(documentId) {
  try {
    const doc = DocumentApp.openById(documentId);
    console.log('Opened document:', doc.getName());
    
    // Note: You can't create UI menus for documents opened by ID
    // This is mainly useful for reading/writing content
    return doc;
  } catch (error) {
    console.log('Could not open document:', error.toString());
    return null;
  }
}

/**
 * Create a new document and bind to it
 */
function createNewDocumentAndBind() {
  try {
    const doc = DocumentApp.create('OER Schema Test Document');
    console.log('Created new document:', doc.getName());
    console.log('Document URL:', doc.getUrl());
    
    // Add some initial content
    const body = doc.getBody();
    body.appendParagraph('OER Schema Components Test Document');
    body.appendParagraph('Use the Extensions menu to access OER Schema components.');
    
    return doc;
  } catch (error) {
    console.log('Could not create document:', error.toString());
    return null;
  }
}
