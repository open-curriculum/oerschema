import { OutlineNode, componentMetadata, OutlineNodeProperties, OutlineNodeRelationships, findAncestors, findAncestorOfType } from "~/lib/outline-types";
import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";
import { getRelationshipProperties, getPropertyLabel, getPropertyDescription } from "~/lib/schema-utils";

interface PropertiesPanelProps {
  node: OutlineNode | null;
  root: OutlineNode | null;
  onUpdateProperties: (nodeId: string, properties: OutlineNodeProperties) => void;
  onUpdateRelationships?: (nodeId: string, relationships: OutlineNodeRelationships) => void;
}

export function PropertiesPanel({ node, root, onUpdateProperties, onUpdateRelationships }: PropertiesPanelProps) {
  const [localProperties, setLocalProperties] = useState<OutlineNodeProperties>({});

  useEffect(() => {
    if (node) {
      setLocalProperties(node.properties);
    }
  }, [node]); // Changed: Watch entire node object, not just node.id

  if (!node) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">No component selected</p>
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const meta = componentMetadata[node.type];
  const relationshipProps = getRelationshipProperties(node.type);

  const handleChange = (key: string, value: any) => {
    const updated = { ...localProperties, [key]: value };
    setLocalProperties(updated);
  };

  const handleSave = () => {
    onUpdateProperties(node.id, localProperties);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{meta.icon}</span>
          <h2 className="text-lg font-semibold">{meta.label}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{meta.description}</p>
      </div>

      <div className="space-y-4">
        {/* Name Field (common to all) */}
        <div>
          <label className="block text-sm font-medium mb-1">Name / Title</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md bg-background resize-y min-h-[60px]"
            value={localProperties.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder={`Enter ${meta.label.toLowerCase()} name or title`}
          />
        </div>

        {/* Description Field (common to all) */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md bg-background resize-y min-h-[100px]"
            value={localProperties.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder={`Enter ${meta.label.toLowerCase()} description`}
          />
        </div>

        {/* Type-specific fields */}
        {node.type === 'Course' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Course Identifier</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={localProperties.courseIdentifier || ''}
                onChange={(e) => handleChange('courseIdentifier', e.target.value)}
                placeholder="e.g., BIOL-101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Institution</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={localProperties.institution || ''}
                onChange={(e) => handleChange('institution', e.target.value)}
                placeholder="e.g., University Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={localProperties.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="e.g., Biology Department"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Term Offered</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={localProperties.termOffered || ''}
                onChange={(e) => handleChange('termOffered', e.target.value)}
                placeholder="e.g., Fall 2025"
              />
            </div>
          </>
        )}

        {node.type === 'LearningObjective' && (
          <div>
            <label className="block text-sm font-medium mb-1">Skill</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md bg-background"
              value={localProperties.skill || ''}
              onChange={(e) => handleChange('skill', e.target.value)}
              placeholder="e.g., explain photosynthesis"
            />
          </div>
        )}

        {(node.type === 'Assessment' || node.type === 'Quiz' || node.type === 'Submission' || node.type === 'Activity') && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Grading Format</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={localProperties.gradingFormat || 'Points'}
                onChange={(e) => handleChange('gradingFormat', e.target.value)}
              >
                <option value="Points">Points</option>
                <option value="Letter">Letter Grade</option>
                <option value="Percent">Percentage</option>
                <option value="Completion">Completion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Points</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={localProperties.points || ''}
                onChange={(e) => handleChange('points', parseInt(e.target.value) || 0)}
                placeholder="e.g., 100"
              />
            </div>
          </>
        )}

        {node.type === 'Rubric' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Rubric Type</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={localProperties.rubricType || 'analytic'}
                onChange={(e) => handleChange('rubricType', e.target.value)}
              >
                <option value="analytic">Analytic</option>
                <option value="holistic">Holistic</option>
                <option value="singlePoint">Single Point</option>
                <option value="checklist">Checklist</option>
              </select>
            </div>
          </>
        )}

        {node.type === 'RubricCriterion' && (
          <div>
            <label className="block text-sm font-medium mb-1">Criterion Weight</label>
            <input
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border rounded-md bg-background"
              value={localProperties.criterionWeight ?? ''}
              onChange={(e) => handleChange('criterionWeight', e.target.value === '' ? undefined : parseFloat(e.target.value))}
              placeholder="e.g., 1.0"
            />
          </div>
        )}

        {node.type === 'RubricScale' && (
          <div className="flex items-center gap-2">
            <input
              id="pointsRequired"
              type="checkbox"
              checked={Boolean(localProperties.pointsRequired)}
              onChange={(e) => handleChange('pointsRequired', e.target.checked)}
            />
            <label htmlFor="pointsRequired" className="text-sm">Points required for each level</label>
          </div>
        )}

        {node.type === 'RubricLevel' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Level Ordinal</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={localProperties.levelOrdinal ?? ''}
                onChange={(e) => handleChange('levelOrdinal', e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                placeholder="e.g., 1 (higher = better)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Level Points</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={localProperties.levelPoints ?? ''}
                onChange={(e) => handleChange('levelPoints', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                placeholder="e.g., 4"
              />
            </div>
          </div>
        )}

        {(node.type === 'Task' || node.type === 'Practice' || node.type === 'Activity') && (
          <div>
            <label className="block text-sm font-medium mb-1">Action Types</label>
            <div className="space-y-2">
              {['Reading', 'Writing', 'Listening', 'Watching', 'Making', 'Discussing', 'Reflecting', 'Observing', 'Presenting'].map(action => (
                <label key={action} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localProperties.actionTypes?.includes(action) || false}
                    onChange={(e) => {
                      const current = localProperties.actionTypes || [];
                      const updated = e.target.checked
                        ? [...current, action]
                        : current.filter(a => a !== action);
                      handleChange('actionTypes', updated);
                    }}
                  />
                  <span className="text-sm">{action}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Relationships Section */}
      {relationshipProps.length > 0 && (
        <div className="pt-4 border-t">
          <h3 className="text-sm font-semibold mb-3">Relationships</h3>
          
          {/* Hierarchical Context */}
          {root && node && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">Hierarchical Position</h4>
              <div className="space-y-1">
                {(() => {
                  const ancestors = findAncestors(root, node.id);
                  const course = findAncestorOfType(root, node.id, 'Course');
                  const directParent = ancestors.length > 0 ? ancestors[ancestors.length - 1] : null;
                  
                  return (
                    <>
                      {directParent && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Direct parent:</span>{' '}
                          <span className="font-medium">{directParent.properties.name || directParent.type}</span>
                          <span className="text-muted-foreground ml-1">({directParent.type})</span>
                        </div>
                      )}
                      {course && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Course:</span>{' '}
                          <span className="font-medium">{course.properties.name || 'Untitled Course'}</span>
                          {node.relationships.forCourse && (
                            <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-1.5 py-0.5 rounded">
                              ✓ Linked
                            </span>
                          )}
                        </div>
                      )}
                      {ancestors.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Depth: {ancestors.length} level{ancestors.length !== 1 ? 's' : ''} from root
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
          
          {/* Schema-based Relationships */}
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">Schema Properties</h4>
          <div className="space-y-3">
            {relationshipProps
              .filter((rel, index, self) => {
                // Remove duplicates by property name
                return index === self.findIndex(r => r.property === rel.property);
              })
              .map(rel => {
                const relValue = node.relationships[rel.property];
                
                // Count relationships
                let count = 0;
                if (Array.isArray(relValue)) {
                  count = relValue.length;
                } else if (relValue) {
                  count = 1;
                }
                
                // Also count direct children for hasComponent relationship
                if (rel.property === 'hasComponent' && node.children) {
                  count = node.children.length;
                }
                
                // Determine if this is a hierarchical relationship
                const isHierarchical = ['hasComponent', 'forComponent', 'childOf', 'parentOf'].includes(rel.property);
                
                // Only show if it has a value OR is a commonly used property for this type
                const commonProperties = ['hasComponent', 'forComponent', 'hasLearningObjective', 'doTask', 'forCourse'];
                const shouldShow = count > 0 || commonProperties.includes(rel.property);
                
                if (!shouldShow) return null;
                
                return (
                  <div key={rel.property} className={`text-sm p-2 rounded ${
                    isHierarchical 
                      ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800' 
                      : 'bg-muted/30'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rel.label}</span>
                        {isHierarchical && (
                          <span className="text-xs bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-1.5 py-0.5 rounded">
                            Tree
                          </span>
                        )}
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-semibold">
                        {count}
                      </span>
                    </div>
                    {rel.comment && (
                      <p className="text-xs text-muted-foreground">{rel.comment}</p>
                    )}
                  </div>
                );
              })
              .filter(Boolean)}
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
