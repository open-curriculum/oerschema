import { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "~/components/ui/dropdown-menu";
import { ComponentPalette } from "~/components/outline-builder/component-palette";
import { OutlineTreeView } from "~/components/outline-builder/outline-tree";
import { PropertiesPanel } from "~/components/outline-builder/properties-panel";
import {
  OutlineNode,
  OutlineNodeType,
  OutlineNodeProperties,
  OutlineNodeRelationships,
  createNode,
  canAddToParent,
  canAddChild,
  moveNode,
  findNodeWithParent,
  getChildIndex,
  propagateForCourse,
} from "~/lib/outline-types";
import { courseTemplates } from "~/lib/outline-templates";
import { findBestRelationship } from "~/lib/schema-validation";
import { Download, FileJson, Code, ChevronDown, FileText } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Outline Builder - OER Schema" },
    { name: "description", content: "Build interactive course outlines using OER Schema components" },
  ];
};

export default function OutlineBuilder() {
  const [root, setRoot] = useState<OutlineNode | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);

  // Find a node by ID in the tree
  const findNode = (node: OutlineNode | null, id: string): OutlineNode | null => {
    if (!node) return null;
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  // Get selected node
  const selectedNode = selectedNodeId ? findNode(root, selectedNodeId) : null;

  // Add component (either as root or to selected node)
  const handleAddComponent = (type: OutlineNodeType) => {
    const newNode = createNode(type);

    if (addingChildTo) {
      // Adding as child to a specific node
      const addChild = (node: OutlineNode): OutlineNode => {
        if (node.id === addingChildTo) {
          if (canAddChild(node.type, type)) {
            // Find the best relationship using schema
            const relationshipProperty = findBestRelationship(node.type, type) || 'hasComponent';
            
            // Update parent relationships
            const updatedRelationships = { ...node.relationships };
            const currentRels = updatedRelationships[relationshipProperty];
            if (Array.isArray(currentRels)) {
              updatedRelationships[relationshipProperty] = [...currentRels, newNode.id];
            } else {
              updatedRelationships[relationshipProperty] = [newNode.id];
            }
            
            // Determine forCourse value
            let forCourseId: string | undefined;
            if (node.type === 'Course') {
              forCourseId = node.id;
            } else if (node.relationships.forCourse) {
              forCourseId = node.relationships.forCourse;
            }
            
            // Update child's inverse relationship
            const updatedNewNode = {
              ...newNode,
              relationships: {
                ...newNode.relationships,
                ...(relationshipProperty === 'hasComponent' && { forComponent: node.id }),
                ...(relationshipProperty === 'hasLearningObjective' && { forComponent: node.id }),
                ...(relationshipProperty === 'doTask' && { forComponent: node.id }),
                ...(relationshipProperty === 'parentOf' && { childOf: [node.id] }),
                ...(forCourseId && { forCourse: forCourseId }),
              },
            };
            
            return {
              ...node,
              children: [...node.children, updatedNewNode],
              relationships: updatedRelationships,
              collapsed: false,
            };
          }
          alert(`Cannot add ${type} to ${node.type}`);
          return node;
        }
        return {
          ...node,
          children: node.children.map(addChild),
        };
      };

      if (root) {
        setRoot(addChild(root));
        setSelectedNodeId(newNode.id);
      }
      setAddingChildTo(null);
    } else if (!root && type === 'Course') {
      // Adding root course
      setRoot(newNode);
      setSelectedNodeId(newNode.id);
    } else if (root && selectedNodeId) {
      // Adding to selected node
      const addChild = (node: OutlineNode): OutlineNode => {
        if (node.id === selectedNodeId) {
          if (canAddChild(node.type, type)) {
            // Find the best relationship using schema
            const relationshipProperty = findBestRelationship(node.type, type) || 'hasComponent';
            
            // Update parent relationships
            const updatedRelationships = { ...node.relationships };
            const currentRels = updatedRelationships[relationshipProperty];
            if (Array.isArray(currentRels)) {
              updatedRelationships[relationshipProperty] = [...currentRels, newNode.id];
            } else {
              updatedRelationships[relationshipProperty] = [newNode.id];
            }
            
            // Determine forCourse value
            let forCourseId: string | undefined;
            if (node.type === 'Course') {
              forCourseId = node.id;
            } else if (node.relationships.forCourse) {
              forCourseId = node.relationships.forCourse;
            }
            
            // Update child's inverse relationship
            const updatedNewNode = {
              ...newNode,
              relationships: {
                ...newNode.relationships,
                ...(relationshipProperty === 'hasComponent' && { forComponent: node.id }),
                ...(relationshipProperty === 'hasLearningObjective' && { forComponent: node.id }),
                ...(relationshipProperty === 'doTask' && { forComponent: node.id }),
                ...(relationshipProperty === 'parentOf' && { childOf: [node.id] }),
                ...(forCourseId && { forCourse: forCourseId }),
              },
            };
            
            return {
              ...node,
              children: [...node.children, updatedNewNode],
              relationships: updatedRelationships,
              collapsed: false,
            };
          }
          alert(`Cannot add ${type} to ${node.type}`);
          return node;
        }
        return {
          ...node,
          children: node.children.map(addChild),
        };
      };

      setRoot(addChild(root));
      setSelectedNodeId(newNode.id);
    } else {
      alert('Please select a parent component first, or add a Course as the root');
    }
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    if (nodeId === root?.id) {
      setRoot(null);
      setSelectedNodeId(null);
      return;
    }

    const deleteNode = (node: OutlineNode): OutlineNode => {
      return {
        ...node,
        children: node.children
          .filter(child => child.id !== nodeId)
          .map(deleteNode),
      };
    };

    if (root) {
      setRoot(deleteNode(root));
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
    }
  };

  // Toggle collapse
  const handleToggleCollapse = (nodeId: string) => {
    const toggle = (node: OutlineNode): OutlineNode => {
      if (node.id === nodeId) {
        return { ...node, collapsed: !node.collapsed };
      }
      return {
        ...node,
        children: node.children.map(toggle),
      };
    };

    if (root) {
      setRoot(toggle(root));
    }
  };

  // Update properties
  const handleUpdateProperties = (nodeId: string, properties: OutlineNodeProperties) => {
    const update = (node: OutlineNode): OutlineNode => {
      if (node.id === nodeId) {
        return { ...node, properties };
      }
      return {
        ...node,
        children: node.children.map(update),
      };
    };

    if (root) {
      setRoot(update(root));
    }
  };

  // Move node via drag and drop
  const handleMoveNode = (nodeId: string, newParentId: string, index: number) => {
    if (!root) return;
    
    // Find the child and parent nodes
    const child = findNode(root, nodeId);
    const parent = findNode(root, newParentId);
    
    if (!child || !parent) return;
    
    // Find the best relationship property using schema
    const relationshipProperty = findBestRelationship(parent.type, child.type) || 'hasComponent';
    
    const result = moveNode(root, nodeId, newParentId, relationshipProperty, index);
    
    if (result === null) {
      // Invalid move
      alert('Cannot move this component to that location');
    } else if (result) {
      setRoot(result);
    }
  };

  // Load a template
  const handleLoadTemplate = (templateId: string) => {
    const template = courseTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    const outline = template.generator();
    // Ensure all descendants have forCourse set
    const outlineWithRelationships = propagateForCourse(outline);
    setRoot(outlineWithRelationships);
    setSelectedNodeId(null);
    setAddingChildTo(null);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (!root) return;
    
    const json = JSON.stringify(root, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `course-outline-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Convert to schema-compliant format
  const handleExportSchema = () => {
    if (!root) return;

    const convertToSchema = (node: OutlineNode): any => {
      const schemaNode: any = {
        '@type': `http://oerschema.org/${node.type}`,
        ...node.properties,
      };
      
      // Add relationships as proper schema properties
      Object.entries(node.relationships).forEach(([property, value]) => {
        if (value) {
          // For now, just include the IDs - in a full implementation,
          // we'd need to resolve these to full objects or URIs
          schemaNode[property] = value;
        }
      });
      
      // Convert children recursively
      if (node.children.length > 0) {
        schemaNode.children = node.children.map(convertToSchema);
      }
      
      return schemaNode;
    };

    const schemaData = convertToSchema(root);
    const json = JSON.stringify(schemaData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `course-schema-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b pb-4 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Course Outline Builder</h1>
        <p className="text-muted-foreground mt-2">
          Create interactive course outlines using OER Schema components
        </p>
        
        {/* Export Buttons */}
        {root && (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleExportJSON}>
              <FileJson className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportSchema}>
              <Code className="w-4 h-4 mr-2" />
              Export as Schema
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Component Palette - Left Sidebar */}
        <div className="col-span-3 border rounded-lg p-4 overflow-y-auto">
          <ComponentPalette onAddComponent={handleAddComponent} />
        </div>

        {/* Outline Tree - Center */}
        <div className="col-span-5 border rounded-lg p-4 overflow-y-auto">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Course Outline</h2>
              <DropdownMenu
                trigger={
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Load Template
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                }
                align="end"
              >
                {courseTemplates.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => handleLoadTemplate(template.id)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {template.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground">
              {root ? 'Click to select, hover for actions' : 'Add a Course to get started'}
            </p>
          </div>
          <OutlineTreeView
            root={root}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onDeleteNode={handleDeleteNode}
            onToggleCollapse={handleToggleCollapse}
            onAddChildPrompt={setAddingChildTo}
            onMoveNode={handleMoveNode}
          />
        </div>

        {/* Properties Panel - Right Sidebar */}
        <div className="col-span-4 border rounded-lg p-4 overflow-y-auto">
          <PropertiesPanel
            node={selectedNode}
            root={root}
            onUpdateProperties={handleUpdateProperties}
          />
        </div>
      </div>

      {/* Add Child Mode Indicator */}
      {addingChildTo && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span>Adding child to: {findNode(root, addingChildTo)?.properties.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => setAddingChildTo(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
