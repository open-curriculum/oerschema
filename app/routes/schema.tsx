import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SchemaTree } from "~/components/schema-tree";
import { schema } from "~/lib/schema";

export const loader = async () => {
  return json({ schema });
};

export default function SchemaPage() {
  const { schema } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">OER Schema Hierarchy</h1>
      <div className="bg-card rounded-lg border p-6">
        <SchemaTree schema={schema} />
      </div>
    </div>
  );
}