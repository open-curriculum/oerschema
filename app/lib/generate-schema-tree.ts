import { Schema } from "./types";

type SchemaNode = {
  id: string;
  label: string;
  children: SchemaNode[];
};

export function generateSchemaTree(schema: Schema): SchemaNode[] {
  // Create a map of all classes
  const classes = schema.classes;
  const classMap: Record<string, SchemaNode> = {};
  
  // Initialize nodes for all classes
  Object.entries(classes).forEach(([id, classInfo]) => {
    classMap[id] = {
      id,
      label: classInfo.label,
      children: [],
    };
  });
  
  // Build parent-child relationships
  Object.entries(classes).forEach(([id, classInfo]) => {
    if (classInfo.subClassOf && classInfo.subClassOf.length > 0) {
      // Find the first subClassOf that exists in our schema
      // (some are external URIs like http://schema.org/Thing)
      const parentId = classInfo.subClassOf.find(parent => 
        !parent.startsWith('http://') && parent in classMap
      );
      
      if (parentId && parentId in classMap) {
        classMap[parentId].children.push(classMap[id]);
      }
    }
  });
  
  // Find root nodes (those that don't have a parent in our schema)
  const rootNodes: SchemaNode[] = [];
  Object.entries(classes).forEach(([id, classInfo]) => {
    const hasParentInSchema = classInfo.subClassOf && classInfo.subClassOf.some(parent => 
      !parent.startsWith('http://') && parent in classMap
    );
    
    if (!hasParentInSchema) {
      rootNodes.push(classMap[id]);
    }
  });
  
  return rootNodes;
}