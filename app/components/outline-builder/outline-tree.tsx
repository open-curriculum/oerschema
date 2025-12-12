import { OutlineNode, componentMetadata, canAddChild } from "~/lib/outline-types";
import { Button } from "~/components/ui/button";
import { ChevronRight, ChevronDown, Trash2, Plus, GripVertical } from "lucide-react";
import { useState } from "react";
import { getPropertyLabel } from "~/lib/schema-utils";

interface OutlineTreeProps {
  node: OutlineNode;
  parentNode?: OutlineNode | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onToggleCollapse: (nodeId: string) => void;
  onAddChildPrompt: (parentId: string) => void;
  onMoveNode: (nodeId: string, newParentId: string, index: number) => void;
  level?: number;
}

type DragPosition = 'before' | 'inside' | 'after' | null;

// Helper to find relationship type between parent and child
function findRelationshipType(parent: OutlineNode | null, childId: string): string | null {
  if (!parent) return null;
  
  for (const [property, value] of Object.entries(parent.relationships)) {
    if (Array.isArray(value) && value.includes(childId)) {
      return property;
    } else if (value === childId) {
      return property;
    }
  }
  
  return null;
}

export function OutlineTree({
  node,
  parentNode = null,
  selectedNodeId,
  onSelectNode,
  onDeleteNode,
  onToggleCollapse,
  onAddChildPrompt,
  onMoveNode,
  level = 0,
}: OutlineTreeProps) {
  const meta = componentMetadata[node.type];
  const isSelected = node.id === selectedNodeId;
  const hasChildren = node.children.length > 0;
  const canHaveChildren = meta.allowedChildren ? meta.allowedChildren.length > 0 : true;
  const relationshipType = findRelationshipType(parentNode, node.id);
  
  const [dragPosition, setDragPosition] = useState<DragPosition>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', node.id);
    
    // Add a visual indicator
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.4';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragging(false);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === node.id) return; // Can't drop on self
    
    // Determine drop position based on mouse position
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    if (canHaveChildren && y > height * 0.3 && y < height * 0.7) {
      setDragPosition('inside');
      e.dataTransfer.dropEffect = 'move';
    } else if (y <= height * 0.3) {
      setDragPosition('before');
      e.dataTransfer.dropEffect = 'move';
    } else {
      setDragPosition('after');
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    // Only clear if we're actually leaving this element
    if (e.currentTarget === e.target) {
      setDragPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === node.id) {
      setDragPosition(null);
      return;
    }
    
    if (dragPosition === 'inside') {
      // Drop as first child
      onMoveNode(draggedId, node.id, 0);
    } else if (dragPosition === 'before' || dragPosition === 'after') {
      // Drop as sibling - need parent
      if (!parentNode) {
        setDragPosition(null);
        return;
      }
      
      // Find current index of this node
      const currentIndex = parentNode.children.findIndex(child => child.id === node.id);
      const newIndex = dragPosition === 'before' ? currentIndex : currentIndex + 1;
      
      onMoveNode(draggedId, parentNode.id, newIndex);
    }
    
    setDragPosition(null);
  };

  return (
    <div className="select-none">
      <div
        draggable={level > 0} // Root can't be dragged
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer
          hover:bg-accent/50 transition-colors group
          ${isSelected ? 'bg-accent border-l-2 border-primary' : ''}
          ${isDragging ? 'opacity-40' : ''}
          ${dragPosition === 'inside' ? 'ring-2 ring-primary ring-inset' : ''}
        `}
        style={{ marginLeft: `${level * 20}px` }}
        onClick={() => onSelectNode(node.id)}
      >
        {/* Drop indicators */}
        {dragPosition === 'before' && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
        )}
        {dragPosition === 'after' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        )}

        {/* Drag handle */}
        {level > 0 && (
          <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        )}

        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            className="p-0 w-4 h-4 flex items-center justify-center hover:bg-accent rounded"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse(node.id);
            }}
          >
            {node.collapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Icon and Label */}
        <span className="text-base">{meta.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium truncate">
              {node.properties.name || meta.label}
            </div>
            {relationshipType && level > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded whitespace-nowrap">
                {getPropertyLabel(relationshipType)}
              </span>
            )}
          </div>
          {node.properties.description && (
            <div className="text-xs text-muted-foreground truncate">
              {node.properties.description}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canHaveChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onAddChildPrompt(node.id);
              }}
              title="Add child component"
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode(node.id);
            }}
            title="Delete component"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && !node.collapsed && (
        <div>
          {node.children.map((child) => (
            <OutlineTree
              key={child.id}
              node={child}
              parentNode={node}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              onDeleteNode={onDeleteNode}
              onToggleCollapse={onToggleCollapse}
              onAddChildPrompt={onAddChildPrompt}
              onMoveNode={onMoveNode}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface OutlineTreeViewProps {
  root: OutlineNode | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onToggleCollapse: (nodeId: string) => void;
  onAddChildPrompt: (parentId: string) => void;
  onMoveNode: (nodeId: string, newParentId: string, index: number) => void;
}

export function OutlineTreeView({
  root,
  selectedNodeId,
  onSelectNode,
  onDeleteNode,
  onToggleCollapse,
  onAddChildPrompt,
  onMoveNode,
}: OutlineTreeViewProps) {
  if (!root) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">No course outline yet</p>
          <p className="text-sm">Add a Course component to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <OutlineTree
        node={root}
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
        onDeleteNode={onDeleteNode}
        onToggleCollapse={onToggleCollapse}
        onAddChildPrompt={onAddChildPrompt}
        onMoveNode={onMoveNode}
      />
    </div>
  );
}
