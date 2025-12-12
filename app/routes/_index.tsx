import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { schema } from "~/lib/schema";
import { generateSchemaTree } from "~/lib/generate-schema-tree";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "OER Schema" },
    { name: "description", content: "Open Educational Resources Schema Documentation" },
  ];
};

export default function Index() {
  const schemaTree = generateSchemaTree(schema);
  const properties = Object.entries(schema.properties);

  return (
    <div className="space-y-8">
      <header className="border-b pb-6 mb-8">
        <h1 className="text-3xl font-bold">OER Schema</h1>
        <p className="mt-2 text-muted-foreground">
          Documentation for the Open Educational Resources Schema
        </p>
      </header>

      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Classes</h2>
          <div className="space-y-2">
            {renderHierarchicalClasses(schemaTree)}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Properties</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map(([name, data]) => (
              <Link 
                key={name}
                to={`/properties/${name}`}
                className="block p-4 rounded-lg border hover:border-primary transition-colors"
              >
                <h3 className="font-semibold">{data.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.comment}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function renderHierarchicalClasses(nodes: Array<{ id: string; label: string; children: any[] }>, level = 0) {
  return nodes.map(node => {
    const classData = schema.classes[node.id];
    
    return (
      <div key={node.id} className={cn(
        "transition-all", 
        level > 0 && "pl-4 ml-3 mt-1"
      )}>
        <Link 
          to={`/classes/${node.id}`}
          className="block p-2 rounded-md hover:bg-accent/50 hover:border-primary transition-colors"
        >
          <h3 className="font-semibold">{node.label || node.id}</h3>
          {classData.comment && (
            <p className="text-sm text-muted-foreground mt-1">
              {classData.comment}
            </p>
          )}
        </Link>
        
        {node.children.length > 0 && (
          <div className="mt-1">
            {renderHierarchicalClasses(node.children, level + 1)}
          </div>
        )}
      </div>
    );
  });
}