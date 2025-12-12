import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { schema } from "~/lib/schema";
import { SchemaGraph } from "~/components/schema-graph";

export const loader = async () => {
  return json({ schema });
};

export default function GraphPage() {
  const { schema } = useLoaderData<typeof loader>();
  
  return (
    <div className="w-full">
      <header className="border-b mb-4">
        <div className="container py-6">
          <h1 className="text-3xl font-bold">OER Schema Graph</h1>
          <p className="text-muted-foreground mt-2">
            Interactive visualization of the OER Schema classes and their relationships
          </p>
        </div>
      </header>
      
      <div className="container">
        <div className="border rounded-lg overflow-hidden">
          <SchemaGraph schema={schema} className="w-full" />
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-medium mb-2">Instructions</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Drag nodes to reposition them</li>
            <li>Scroll to zoom in/out</li>
            <li>Click and drag the canvas to pan</li>
            <li>Use the controls in the bottom-right to zoom and fit the view</li>
            <li>Use the mini-map in the bottom-right for navigation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}