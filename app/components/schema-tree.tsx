import { Link } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { Schema } from "~/lib/types";
import { generateSchemaTree } from "~/lib/generate-schema-tree";

type SchemaTreeProps = {
  schema: Schema;
};

export function SchemaTree({ schema }: SchemaTreeProps) {
  const schemaTree = generateSchemaTree(schema);
  
  return (
    <div className="mt-4">
      <ul className="schema-tree space-y-0.5">
        {renderTreeNodes(schemaTree)}
      </ul>
    </div>
  );
}

function renderTreeNodes(nodes: Array<{ id: string; label: string; children: any[] }>) {
  return nodes.map(node => (
    <li key={node.id} className="my-px">
      <Link 
        to={`/classes/${node.id}`} 
        className="block px-2 py-1.5 rounded-md hover:bg-muted hover:text-foreground transition-colors duration-150 ease-in-out"
      >
        {node.label || node.id}
      </Link>
      {node.children.length > 0 && (
        <ul className="schema-tree mt-1 pl-5 border-l border-border">
          {renderTreeNodes(node.children)}
        </ul>
      )}
    </li>
  ));
}