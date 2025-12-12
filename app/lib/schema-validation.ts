/**
 * Schema-based validation for outline builder relationships
 * Uses the actual OER Schema class hierarchy and property domains/ranges
 */

import { schema } from "./schema";
import { OutlineNodeType } from "./outline-types";
import { getClassProperties, isPropertyValidForClass, isClassValidForPropertyRange } from "./schema-utils";

/**
 * Check if a child class can be added to a parent based on schema properties
 */
export function canAddChildBySchema(parentType: OutlineNodeType, childType: OutlineNodeType): boolean {
  console.log(`Checking if ${childType} can be added to ${parentType}...`);
  
  // Check if parent has hasComponent property and child is in its range
  if (isPropertyValidForClass(parentType, 'hasComponent')) {
    console.log(`  ${parentType} has 'hasComponent' property`);
    if (isClassValidForPropertyRange('hasComponent', childType)) {
      console.log(`  ✓ ${childType} is valid for hasComponent range`);
      return true;
    } else {
      console.log(`  ✗ ${childType} is NOT in hasComponent range`);
    }
  } else {
    console.log(`  ${parentType} does NOT have 'hasComponent' property`);
  }
  
  // Check for specific relationship properties
  const relationshipProperties = [
    'hasLearningObjective',
    'doTask',
    'material',
    'section',
    'parentOf',
    'rubric',
    'hasCriterion',
    'rubricScale',
    'hasLevel',
  ];
  
  for (const prop of relationshipProperties) {
    if (isPropertyValidForClass(parentType, prop)) {
      if (isClassValidForPropertyRange(prop, childType)) {
        console.log(`  ✓ Valid via ${prop} property`);
        return true;
      }
    }
  }
  
  console.log(`  ✗ No valid relationship found`);
  return false;
}

/**
 * Check if a child type is a subclass of (or is) a target type
 */
export function isSubclassOf(childType: string, parentType: string, visited = new Set<string>()): boolean {
  if (childType === parentType) return true;
  
  // Prevent infinite recursion
  if (visited.has(childType)) return false;
  visited.add(childType);
  
  const childClass = schema.classes[childType];
  if (!childClass) return false;
  
  // Check immediate parents
  for (const parent of childClass.subClassOf) {
    // Skip external URIs
    if (parent.startsWith('http://') || parent.startsWith('https://')) continue;
    
    const parentName = parent.split('/').pop() || parent;
    if (parentName === parentType) return true;
    
    // Recursively check parent's ancestors
    if (isSubclassOf(parentName, parentType, visited)) return true;
  }
  
  return false;
}

/**
 * Get all valid child types for a parent based on schema
 */
export function getValidChildTypes(parentType: OutlineNodeType): OutlineNodeType[] {
  const validTypes: OutlineNodeType[] = [];
  
  // Get all properties that the parent can use
  const properties = getClassProperties(parentType);
  
  // For each property, check what types are in its range
  for (const propName of properties) {
    const prop = schema.properties[propName];
    if (!prop) continue;
    
    // Skip non-relationship properties
    const relationshipProps = ['hasComponent', 'hasLearningObjective', 'doTask', 'material', 'section', 'parentOf'];
    if (!relationshipProps.includes(propName)) continue;
    
    // Check each range type
    for (const rangeType of prop.range) {
      // Skip external URIs and primitives
      if (rangeType.startsWith('http://') || rangeType.startsWith('https://')) continue;
      if (['Text', 'Number', 'Integer', 'Boolean', 'Date', 'DateTime', 'Time', 'URL'].includes(rangeType)) continue;
      
      // Add this type if it's a valid OutlineNodeType
      const nodeTypes: OutlineNodeType[] = [
        'Course', 'Module', 'Unit', 'Lesson',
        'Topic', 'LearningObjective', 'LearningComponent',
        'AssociatedMaterial', 'SupportingMaterial', 'SupplementalMaterial', 'ReferencedMaterial',
        'Task', 'Practice', 'Activity', 'Project',
        'Assessment', 'Quiz', 'Submission',
        'Rubric', 'RubricCriterion', 'RubricScale', 'RubricLevel'
      ];
      
      // Check if this type or any of its subclasses match
      for (const nodeType of nodeTypes) {
        if (isSubclassOf(nodeType, rangeType) && !validTypes.includes(nodeType)) {
          validTypes.push(nodeType);
        }
      }
    }
  }
  
  return validTypes;
}

/**
 * Get all valid parent types for a child based on schema
 */
export function getValidParentTypes(childType: OutlineNodeType): OutlineNodeType[] {
  const validTypes: OutlineNodeType[] = [];
  
  const allNodeTypes: OutlineNodeType[] = [
    'Course', 'Module', 'Unit', 'Lesson',
    'Topic', 'LearningObjective', 'LearningComponent',
    'AssociatedMaterial', 'SupportingMaterial', 'SupplementalMaterial', 'ReferencedMaterial',
    'Task', 'Practice', 'Activity', 'Project',
    'Assessment', 'Quiz', 'Submission',
    'Rubric', 'RubricCriterion', 'RubricScale', 'RubricLevel'
  ];
  
  // Check each potential parent type
  for (const potentialParent of allNodeTypes) {
    if (canAddChildBySchema(potentialParent, childType)) {
      validTypes.push(potentialParent);
    }
  }
  
  return validTypes;
}

/**
 * Find the best relationship property to use between parent and child
 */
export function findBestRelationship(parentType: OutlineNodeType, childType: OutlineNodeType): string | null {
  // Check specific relationships first (most specific to most general)
  const relationshipChecks = [
    { prop: 'rubric', priority: 0 },
    { prop: 'hasCriterion', priority: 1 },
    { prop: 'rubricScale', priority: 1 },
    { prop: 'hasLevel', priority: 2 },
    { prop: 'hasLearningObjective', priority: 1 },
    { prop: 'doTask', priority: 2 },
    { prop: 'material', priority: 3 },
    { prop: 'section', priority: 4 },
    { prop: 'hasComponent', priority: 5 },
    { prop: 'parentOf', priority: 6 },
  ];
  
  for (const { prop } of relationshipChecks.sort((a, b) => a.priority - b.priority)) {
    if (isPropertyValidForClass(parentType, prop) && isClassValidForPropertyRange(prop, childType)) {
      return prop;
    }
  }
  
  return null;
}

/**
 * Validate a relationship between two nodes
 */
export function validateRelationship(
  parentType: OutlineNodeType,
  childType: OutlineNodeType,
  relationshipProperty: string
): { valid: boolean; reason?: string } {
  // Check if the property is valid for the parent class
  if (!isPropertyValidForClass(parentType, relationshipProperty)) {
    return {
      valid: false,
      reason: `Property ${relationshipProperty} is not valid for ${parentType}`,
    };
  }
  
  // Check if the child type is in the property's range
  if (!isClassValidForPropertyRange(relationshipProperty, childType)) {
    return {
      valid: false,
      reason: `${childType} is not in the range of ${relationshipProperty}`,
    };
  }
  
  return { valid: true };
}
