/**
 * Schema utilities for working with OER Schema relationships
 */

import { schema } from "./schema";
import { OutlineNodeType } from "./outline-types";

/**
 * Get all properties that a class can use (including inherited)
 */
export function getClassProperties(className: string, visited = new Set<string>()): string[] {
  const classData = schema.classes[className];
  if (!classData) return [];
  
  // Prevent infinite recursion
  if (visited.has(className)) return [];
  visited.add(className);
  
  const properties = [...classData.properties];
  
  // Add properties from parent classes
  for (const parent of classData.subClassOf) {
    // Skip external URIs (like http://schema.org/Thing)
    if (parent.startsWith('http://') || parent.startsWith('https://')) continue;
    
    const parentName = parent.split('/').pop() || parent;
    if (schema.classes[parentName]) {
      properties.push(...getClassProperties(parentName, visited));
    }
  }
  
  return [...new Set(properties)]; // Remove duplicates
}

/**
 * Get properties that create relationships to other components
 */
export function getRelationshipProperties(className: string): Array<{
  property: string;
  label: string;
  comment: string;
  range: string[];
  inverseOf?: string;
}> {
  const classProps = getClassProperties(className);
  
  return classProps
    .map(propName => {
      const prop = schema.properties[propName];
      if (!prop) return null;
      
      // Filter for properties that reference other classes (not primitives)
      const hasClassRange = prop.range.some(r => 
        !r.startsWith('http://') && 
        !['Text', 'Number', 'Integer', 'Boolean', 'Date', 'DateTime', 'Time', 'URL'].includes(r)
      );
      
      if (!hasClassRange) return null;
      
      return {
        property: propName,
        label: prop.label,
        comment: prop.comment,
        range: prop.range,
        inverseOf: prop.inverseOf,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
}

/**
 * Check if a property is valid for a class
 */
export function isPropertyValidForClass(className: string, propertyName: string): boolean {
  const prop = schema.properties[propertyName];
  if (!prop) return false;
  
  // Check if this class or any of its parents are in the property's domain
  return isClassInDomain(className, prop.domain);
}

/**
 * Check if a class is in a property's domain (including inheritance)
 */
function isClassInDomain(className: string, domain: string[], visited = new Set<string>()): boolean {
  if (domain.includes(className)) return true;
  
  // Prevent infinite recursion
  if (visited.has(className)) return false;
  visited.add(className);
  
  const classData = schema.classes[className];
  if (!classData) return false;
  
  // Check parent classes
  for (const parent of classData.subClassOf) {
    // Skip external URIs
    if (parent.startsWith('http://') || parent.startsWith('https://')) continue;
    
    const parentName = parent.split('/').pop() || parent;
    if (isClassInDomain(parentName, domain, visited)) return true;
  }
  
  return false;
}

/**
 * Check if a target class is valid for a property's range
 */
export function isClassValidForPropertyRange(propertyName: string, targetClassName: string): boolean {
  const prop = schema.properties[propertyName];
  if (!prop) return false;
  
  // Check if target class or any of its parents are in the range
  return isClassInRange(targetClassName, prop.range);
}

/**
 * Check if a class matches the property range (including inheritance)
 */
function isClassInRange(className: string, range: string[], visited = new Set<string>()): boolean {
  // Check direct match
  if (range.includes(className)) return true;
  
  // Prevent infinite recursion
  if (visited.has(className)) return false;
  visited.add(className);
  
  // Check if any range item is a parent of this class
  const classData = schema.classes[className];
  if (!classData) return false;
  
  for (const parent of classData.subClassOf) {
    // Skip external URIs
    if (parent.startsWith('http://') || parent.startsWith('https://')) continue;
    
    const parentName = parent.split('/').pop() || parent;
    if (range.includes(parentName) || isClassInRange(parentName, range, visited)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get the inverse property name if it exists
 */
export function getInverseProperty(propertyName: string): string | null {
  const prop = schema.properties[propertyName];
  return prop?.inverseOf || null;
}

/**
 * Find a property that has this as its inverse
 */
export function findPropertyWithInverse(propertyName: string): string | null {
  for (const [name, prop] of Object.entries(schema.properties)) {
    if (prop.inverseOf === propertyName) {
      return name;
    }
  }
  return null;
}

/**
 * Get valid relationship properties for adding children
 */
export function getValidChildRelationships(
  parentType: OutlineNodeType,
  childType: OutlineNodeType
): string[] {
  const relationshipProps = getRelationshipProperties(parentType);
  
  return relationshipProps
    .filter(prop => isClassValidForPropertyRange(prop.property, childType))
    .map(prop => prop.property);
}

/**
 * Suggest the best relationship property for a parent-child pair
 */
export function suggestRelationship(
  parentType: OutlineNodeType,
  childType: OutlineNodeType
): string {
  const validProps = getValidChildRelationships(parentType, childType);
  
  // Priority order for common relationships
  const priorities = [
    'rubric',
    'hasCriterion',
    'rubricScale',
    'hasLevel',
    'hasComponent',
    'hasLearningObjective',
    'doTask',
    'material',
    'forTopic',
    'section',
    'syllabus',
    'assessedBy',
    'assessing',
    'childOf',
  ];
  
  for (const priority of priorities) {
    if (validProps.includes(priority)) {
      return priority;
    }
  }
  
  // Return first valid property or default to 'childOf'
  return validProps[0] || 'childOf';
}

/**
 * Get all classes that can be targets for a property
 */
export function getValidTargetClasses(propertyName: string): string[] {
  const prop = schema.properties[propertyName];
  if (!prop) return [];
  
  return prop.range.filter(r => 
    !r.startsWith('http://') && 
    schema.classes[r] !== undefined
  );
}

/**
 * Check if a class is an InstructionalPattern (for hasLearningObjective)
 */
export function isInstructionalPattern(className: string): boolean {
  return isClassInRange(className, ['InstructionalPattern']);
}

/**
 * Check if a class is a Task (for typeOfAction)
 */
export function isTask(className: string): boolean {
  return isClassInRange(className, ['Task']);
}

/**
 * Check if a class is a Resource
 */
export function isResource(className: string): boolean {
  return isClassInRange(className, ['Resource']);
}

/**
 * Check if a class is a LearningComponent
 */
export function isLearningComponent(className: string): boolean {
  return isClassInRange(className, ['LearningComponent']);
}

/**
 * Get all ActionType classes
 */
export function getActionTypes(): string[] {
  return Object.keys(schema.classes).filter(name => 
    isClassInRange(name, ['ActionType'])
  );
}

/**
 * Get user-friendly property label
 */
export function getPropertyLabel(propertyName: string): string {
  const prop = schema.properties[propertyName];
  return prop?.label || propertyName;
}

/**
 * Get property description
 */
export function getPropertyDescription(propertyName: string): string {
  const prop = schema.properties[propertyName];
  return prop?.comment || '';
}
