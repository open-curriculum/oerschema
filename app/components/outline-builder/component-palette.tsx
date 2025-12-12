import { componentMetadata, OutlineNodeType } from "~/lib/outline-types";
import { Button } from "~/components/ui/button";

interface ComponentPaletteProps {
  onAddComponent: (type: OutlineNodeType) => void;
}

export function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  // Group components by category
  const categories = {
    structural: [] as OutlineNodeType[],
    content: [] as OutlineNodeType[],
    material: [] as OutlineNodeType[],
    task: [] as OutlineNodeType[],
    assessment: [] as OutlineNodeType[],
  };

  Object.entries(componentMetadata).forEach(([type, meta]) => {
    categories[meta.category].push(type as OutlineNodeType);
  });

  const categoryLabels = {
    structural: 'Structure',
    content: 'Content',
    material: 'Materials',
    task: 'Tasks',
    assessment: 'Assessments',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Component Palette</h2>
        <p className="text-sm text-muted-foreground">
          Click to add components to your outline
        </p>
      </div>

      {Object.entries(categories).map(([category, types]) => (
        <div key={category}>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wide">
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h3>
          <div className="space-y-1">
            {types.map((type) => {
              const meta = componentMetadata[type];
              return (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => onAddComponent(type)}
                  title={meta.description}
                >
                  <span className="mr-2 text-base">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{meta.label}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {meta.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
