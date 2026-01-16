/**
 * Types for the Course Outline Builder
 */

import { canAddChildBySchema } from './schema-validation';

export type OutlineNodeType = 
  // Structural components
  | 'Course'
  | 'Module'
  | 'Unit'
  | 'Lesson'
  // Content components
  | 'Topic'
  | 'LearningObjective'
  | 'LearningComponent'
  // Material components
  | 'AssociatedMaterial'
  | 'SupportingMaterial'
  | 'SupplementalMaterial'
  | 'ReferencedMaterial'
  // Task components
  | 'Task'
  | 'Practice'
  | 'Activity'
  | 'Project'
  // Assessment components
  | 'Assessment'
  | 'Quiz'
  | 'Submission'
  // Rubric components
  | 'Rubric'
  | 'RubricCriterion'
  | 'RubricScale'
  | 'RubricLevel';

export interface OutlineNodeProperties {
  // Common properties from Thing
  name?: string;
  description?: string;
  
  // Course-specific
  courseIdentifier?: string;
  institution?: string;
  department?: string;
  termOffered?: string;
  
  // Learning-specific
  skill?: string;
  
  // Assessment-specific
  gradingFormat?: string;
  points?: number;

  // Task-specific
  aiUsageConstraint?: string | string[];

  // Rubric-specific
  rubricType?: string;
  criterionWeight?: number;
  levelOrdinal?: number;
  levelPoints?: number;
  pointsRequired?: boolean;
  
  // Action types
  actionTypes?: string[];
  
  // Material references
  materialReferences?: string[];
  
  // Custom properties
  [key: string]: any;
}

/**
 * Relationships between nodes using actual schema properties
 */
export interface OutlineNodeRelationships {
  // Generic relationships
  parentOf?: string[];
  childOf?: string[];
  
  // Component relationships
  hasComponent?: string[];
  forComponent?: string;
  
  // Learning objectives
  hasLearningObjective?: string[];
  
  // Tasks
  doTask?: string[];
  
  // Topics and materials
  forTopic?: string;
  material?: string[];
  
  // Course relationships
  forCourse?: string;
  section?: string[];
  syllabus?: string;
  
  // Assessment relationships
  assessing?: string;
  assessedBy?: string;
  rubric?: string;
  hasCriterion?: string[];
  rubricScale?: string;
  hasLevel?: string[];
  
  // Other schema properties
  [property: string]: string | string[] | undefined;
}

export interface OutlineNode {
  id: string;
  type: OutlineNodeType;
  properties: OutlineNodeProperties;
  relationships: OutlineNodeRelationships;
  children: OutlineNode[]; // Kept for UI tree rendering
  collapsed?: boolean;
}

export interface OutlineState {
  root: OutlineNode | null;
  selectedNodeId: string | null;
}

/**
 * Component metadata for the palette
 * Note: Relationship validation is now schema-based, not hardcoded
 */
export interface ComponentMetadata {
  type: OutlineNodeType;
  label: string;
  icon: string;
  description: string;
  category: 'structural' | 'content' | 'material' | 'task' | 'assessment';
  defaultProperties?: Partial<OutlineNodeProperties>;
  allowedChildren?: OutlineNodeType[];
}

/**
 * Metadata for all available components
 * Note: Parent/child relationships are validated through schema, not hardcoded here
 */
export const componentMetadata: Record<OutlineNodeType, ComponentMetadata> = {
  Course: {
    type: 'Course',
    label: 'Course',
    icon: '📚',
    description: 'An instructional course',
    category: 'structural',
    defaultProperties: {
      name: 'Untitled Course',
      courseIdentifier: '',
    },
  },
  Module: {
    type: 'Module',
    label: 'Module',
    icon: '📦',
    description: 'A collection of related units or lessons',
    category: 'structural',
    defaultProperties: {
      name: 'Untitled Module',
    },
  },
  Unit: {
    type: 'Unit',
    label: 'Unit',
    icon: '📑',
    description: 'A thematic grouping of lessons',
    category: 'structural',
    defaultProperties: {
      name: 'Untitled Unit',
    },
  },
  Lesson: {
    type: 'Lesson',
    label: 'Lesson',
    icon: '📖',
    description: 'A single learning session',
    category: 'structural',
    defaultProperties: {
      name: 'Untitled Lesson',
    },
  },
  Topic: {
    type: 'Topic',
    label: 'Topic',
    icon: '🏷️',
    description: 'The subject matter or context',
    category: 'content',
    defaultProperties: {
      name: 'Untitled Topic',
    },
  },
  LearningObjective: {
    type: 'LearningObjective',
    label: 'Learning Objective',
    icon: '🎯',
    description: 'An expected learning outcome',
    category: 'content',
    defaultProperties: {
      name: 'Untitled Objective',
      skill: '',
    },
  },
  LearningComponent: {
    type: 'LearningComponent',
    label: 'Learning Component',
    icon: '🧩',
    description: 'A generic learning content piece',
    category: 'content',
    defaultProperties: {
      name: 'Untitled Component',
    },
  },
  AssociatedMaterial: {
    type: 'AssociatedMaterial',
    label: 'Associated Material',
    icon: '📄',
    description: 'Material associated with the course',
    category: 'material',
    defaultProperties: {
      name: 'Untitled Material',
    },
  },
  SupportingMaterial: {
    type: 'SupportingMaterial',
    label: 'Supporting Material',
    icon: '📚',
    description: 'Material that teaches the learning objectives',
    category: 'material',
    defaultProperties: {
      name: 'Untitled Supporting Material',
    },
  },
  SupplementalMaterial: {
    type: 'SupplementalMaterial',
    label: 'Supplemental Material',
    icon: '📋',
    description: 'Additional information and guides',
    category: 'material',
    defaultProperties: {
      name: 'Untitled Supplemental Material',
    },
  },
  ReferencedMaterial: {
    type: 'ReferencedMaterial',
    label: 'Referenced Material',
    icon: '🔗',
    description: 'Referenced sources and primary materials',
    category: 'material',
    defaultProperties: {
      name: 'Untitled Referenced Material',
    },
  },
  Task: {
    type: 'Task',
    label: 'Task',
    icon: '✅',
    description: 'A task for students to complete',
    category: 'task',
    defaultProperties: {
      name: 'Untitled Task',
      actionTypes: [],
    },
  },
  Practice: {
    type: 'Practice',
    label: 'Practice',
    icon: '🔬',
    description: 'Hands-on practice activity',
    category: 'task',
    defaultProperties: {
      name: 'Untitled Practice',
      actionTypes: [],
    },
  },
  Activity: {
    type: 'Activity',
    label: 'Activity',
    icon: '🎨',
    description: 'A graded student activity',
    category: 'task',
    defaultProperties: {
      name: 'Untitled Activity',
      actionTypes: [],
    },
  },
  Project: {
    type: 'Project',
    label: 'Project',
    icon: '🏗️',
    description: 'A multi-skill project',
    category: 'task',
    defaultProperties: {
      name: 'Untitled Project',
    },
  },
  Assessment: {
    type: 'Assessment',
    label: 'Assessment',
    icon: '📝',
    description: 'An assessment of student work',
    category: 'assessment',
    defaultProperties: {
      name: 'Untitled Assessment',
      gradingFormat: 'Points',
    },
  },
  Quiz: {
    type: 'Quiz',
    label: 'Quiz',
    icon: '❓',
    description: 'A quiz assessment',
    category: 'assessment',
    defaultProperties: {
      name: 'Untitled Quiz',
      gradingFormat: 'Points',
    },
  },
  Submission: {
    type: 'Submission',
    label: 'Submission',
    icon: '📤',
    description: 'A student submission assessment',
    category: 'assessment',
    defaultProperties: {
      name: 'Untitled Submission',
      gradingFormat: 'Points',
    },
  },
  Rubric: {
    type: 'Rubric',
    label: 'Rubric',
    icon: '📏',
    description: 'A scoring guide with criteria and performance levels',
    category: 'assessment',
    defaultProperties: {
      name: 'Untitled Rubric',
      rubricType: 'analytic',
    },
    allowedChildren: ['RubricCriterion', 'RubricScale'],
  },
  RubricCriterion: {
    type: 'RubricCriterion',
    label: 'Rubric Criterion',
    icon: '📐',
    description: 'A criterion that will be scored in the rubric',
    category: 'assessment',
    defaultProperties: {
      name: 'Untitled Criterion',
      criterionWeight: 1,
    },
    allowedChildren: [],
  },
  RubricScale: {
    type: 'RubricScale',
    label: 'Rubric Scale',
    icon: '📊',
    description: 'A performance level scale used by the rubric',
    category: 'assessment',
    defaultProperties: {
      name: 'Default Scale',
      pointsRequired: true,
    },
    allowedChildren: ['RubricLevel'],
  },
  RubricLevel: {
    type: 'RubricLevel',
    label: 'Rubric Level',
    icon: '⬆️',
    description: 'A level on the performance scale (e.g., Proficient)',
    category: 'assessment',
    defaultProperties: {
      name: 'Level',
      levelOrdinal: 1,
      levelPoints: 0,
    },
    allowedChildren: [],
  },
};

/**
 * Helper function to generate a unique ID
 */
export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper function to create a new node
 */
export function createNode(
  type: OutlineNodeType,
  properties?: Partial<OutlineNodeProperties>,
  relationships?: Partial<OutlineNodeRelationships>
): OutlineNode {
  const metadata = componentMetadata[type];
  return {
    id: generateNodeId(),
    type,
    properties: {
      ...metadata.defaultProperties,
      ...properties,
    },
    relationships: relationships || {},
    children: [],
    collapsed: false,
  };
}

/**
 * Helper to check if a child type is allowed for a parent type
 * Always uses schema-based validation
 */
export function canAddChild(
  parentType: OutlineNodeType,
  childType: OutlineNodeType
): boolean {
  // Always use schema-based validation
  const result = canAddChildBySchema(parentType, childType);
  
  // Debug logging
  if (!result) {
    console.log(`Schema validation failed: Cannot add ${childType} to ${parentType}`);
  }
  
  return result;
}

/**
 * Helper to check if a node can be added to a parent
 * Always uses schema-based validation
 */
export function canAddToParent(parentType: OutlineNodeType | null, nodeType: OutlineNodeType): boolean {
  if (!parentType) return nodeType === 'Course'; // Only Course can be root
  
  // Use schema-based validation
  const { canAddChildBySchema } = require('./schema-validation');
  return canAddChildBySchema(parentType, nodeType);
}

/**
 * Find a node and its parent in the tree
 */
export function findNodeWithParent(
  root: OutlineNode | null,
  targetId: string,
  parent: OutlineNode | null = null
): { node: OutlineNode | null; parent: OutlineNode | null } {
  if (!root) return { node: null, parent: null };
  if (root.id === targetId) return { node: root, parent };
  
  for (const child of root.children) {
    const result = findNodeWithParent(child, targetId, root);
    if (result.node) return result;
  }
  
  return { node: null, parent: null };
}

/**
 * Remove a node from the tree
 */
export function removeNode(root: OutlineNode, nodeId: string): OutlineNode {
  return {
    ...root,
    children: root.children
      .filter(child => child.id !== nodeId)
      .map(child => removeNode(child, nodeId)),
  };
}

/**
 * Insert a node at a specific position with a relationship property
 */
export function insertNode(
  root: OutlineNode,
  parentId: string,
  node: OutlineNode,
  relationshipProperty: string = 'childOf',
  index?: number
): OutlineNode {
  if (root.id === parentId) {
    const newChildren = [...root.children];
    if (index !== undefined && index >= 0 && index <= newChildren.length) {
      newChildren.splice(index, 0, node);
    } else {
      newChildren.push(node);
    }
    
    // Update parent's relationships
    const updatedRelationships = { ...root.relationships };
    const currentRels = updatedRelationships[relationshipProperty];
    
    if (Array.isArray(currentRels)) {
      updatedRelationships[relationshipProperty] = [...currentRels, node.id];
    } else {
      updatedRelationships[relationshipProperty] = [node.id];
    }
    
    // Update child's inverse relationship
    const updatedNode = {
      ...node,
      relationships: {
        ...node.relationships,
        // Add inverse relationship (e.g., if parent has hasComponent, child gets forComponent)
        ...(relationshipProperty === 'hasComponent' && { forComponent: parentId }),
        ...(relationshipProperty === 'hasLearningObjective' && { forComponent: parentId }),
        ...(relationshipProperty === 'doTask' && { forComponent: parentId }),
        ...(relationshipProperty === 'parentOf' && { childOf: [parentId] }),
      },
    };
    
    // Replace in the correct position
    const targetIndex = index !== undefined ? index : newChildren.length - 1;
    newChildren[targetIndex] = updatedNode;
    
    return {
      ...root,
      children: newChildren,
      relationships: updatedRelationships,
      collapsed: false,
    };
  }
  
  return {
    ...root,
    children: root.children.map(child => insertNode(child, parentId, node, relationshipProperty, index)),
  };
}

/**
 * Move a node to a new parent at a specific position
 */
export function moveNode(
  root: OutlineNode,
  nodeId: string,
  newParentId: string,
  relationshipProperty: string = 'childOf',
  index?: number
): OutlineNode | null {
  // Find the node to move
  const { node, parent } = findNodeWithParent(root, nodeId);
  if (!node) return root;
  
  // Can't move root
  if (root.id === nodeId) return root;
  
  // Can't move to itself or its descendants
  if (nodeId === newParentId || isDescendant(node, newParentId)) {
    return root;
  }
  
  // Check if the move is valid
  const { node: newParent } = findNodeWithParent(root, newParentId);
  if (!newParent) return root;
  if (!canAddChild(newParent.type, node.type)) {
    return null; // Invalid move
  }
  
  // Special case: reordering within same parent
  if (parent?.id === newParentId) {
    const oldIndex = parent.children.findIndex(c => c.id === nodeId);
    let targetIndex = index !== undefined ? index : parent.children.length;
    
    // Adjust index if moving down within same parent
    if (oldIndex < targetIndex) {
      targetIndex = targetIndex - 1;
    }
    
    return reorderChild(root, newParentId, oldIndex, targetIndex);
  }
  
  // Remove from old location
  let updated = removeNode(root, nodeId);
  
  // Insert at new location
  updated = insertNode(updated, newParentId, node, relationshipProperty, index);
  
  return updated;
}

/**
 * Reorder a child within its parent
 */
function reorderChild(
  root: OutlineNode,
  parentId: string,
  fromIndex: number,
  toIndex: number
): OutlineNode {
  if (root.id === parentId) {
    const newChildren = [...root.children];
    const [movedItem] = newChildren.splice(fromIndex, 1);
    newChildren.splice(toIndex, 0, movedItem);
    return {
      ...root,
      children: newChildren,
    };
  }
  
  return {
    ...root,
    children: root.children.map(child => reorderChild(child, parentId, fromIndex, toIndex)),
  };
}

/**
 * Check if a node is a descendant of another node
 */
function isDescendant(ancestor: OutlineNode, descendantId: string): boolean {
  if (ancestor.id === descendantId) return true;
  return ancestor.children.some(child => isDescendant(child, descendantId));
}

/**
 * Get the index of a child in its parent
 */
export function getChildIndex(parent: OutlineNode, childId: string): number {
  return parent.children.findIndex(child => child.id === childId);
}

/**
 * Find all ancestors of a node (path from root to node)
 */
export function findAncestors(root: OutlineNode | null, nodeId: string, path: OutlineNode[] = []): OutlineNode[] {
  if (!root) return [];
  
  if (root.id === nodeId) {
    return path;
  }
  
  for (const child of root.children) {
    const result = findAncestors(child, nodeId, [...path, root]);
    if (result.length > 0) {
      return result;
    }
  }
  
  return [];
}

/**
 * Find the closest ancestor of a specific type
 */
export function findAncestorOfType(root: OutlineNode | null, nodeId: string, type: OutlineNodeType): OutlineNode | null {
  const ancestors = findAncestors(root, nodeId);
  // Search from closest to furthest
  for (let i = ancestors.length - 1; i >= 0; i--) {
    if (ancestors[i].type === type) {
      return ancestors[i];
    }
  }
  return null;
}

/**
 * Recursively set forCourse relationship on all descendants
 */
export function propagateForCourse(node: OutlineNode, courseId?: string): OutlineNode {
  // Determine the course ID to use
  const forCourseId = courseId || (node.type === 'Course' ? node.id : node.relationships.forCourse);
  
  // Update this node's forCourse if it doesn't have one and we have a courseId
  const updatedNode = {
    ...node,
    relationships: {
      ...node.relationships,
      ...(forCourseId && node.type !== 'Course' && { forCourse: forCourseId }),
    },
  };
  
  // Recursively update all children
  if (updatedNode.children.length > 0) {
    return {
      ...updatedNode,
      children: updatedNode.children.map(child => propagateForCourse(child, forCourseId)),
    };
  }
  
  return updatedNode;
}
