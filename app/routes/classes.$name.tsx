import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { schema } from "~/lib/schema";
import { Button } from "~/components/ui/button";
import { SchemaExamples } from "~/components/schema-examples";
import { ApiCard } from "~/components/api-card";

export async function loader({ params }: LoaderFunctionArgs) {
  const className = params.name;
  const classData = schema.classes[className as string];

  if (!classData) {
    throw new Response("Not Found", { status: 404 });
  }

  // Find subclasses that inherit from this class
  const subClasses = Object.entries(schema.classes)
    .filter(([_, data]) => data.subClassOf.includes(className as string))
    .map(([name, data]) => ({ name, label: data.label }));

  // Get properties with their details by class inheritance
  const propertiesByClass = new Map();
  
  // Start with the current class
  if (classData.properties.length > 0) {
    propertiesByClass.set(className, classData.properties.map(propName => {
      const propData = schema.properties[propName];
      return {
        name: propName,
        data: propData
      };
    }));
  }
  
  // Get inherited properties from parent classes
  const getParentClasses = (name, visited = new Set()) => {
    if (visited.has(name)) return; // Avoid circular references
    visited.add(name);
    
    const cls = schema.classes[name];
    if (!cls) return;
    
    cls.subClassOf.forEach(parent => {
      // Only include schema classes, not external ones like schema.org
      if (parent && !parent.startsWith('http://') && schema.classes[parent]) {
        const parentClass = schema.classes[parent];
        if (parentClass.properties.length > 0) {
          const props = parentClass.properties.map(propName => {
            const propData = schema.properties[propName];
            return {
              name: propName,
              data: propData
            };
          });
          
          propertiesByClass.set(parent, props);
        }
        getParentClasses(parent, visited);
      }
    });
  };
  
  getParentClasses(className);

  return json({ classData, className, subClasses, propertiesByClass: Array.from(propertiesByClass.entries()) });
}

export default function ClassPage() {
  const { classData, className, subClasses, propertiesByClass } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{className}</h1>
            <Button variant="outline" size="sm" asChild>
              <Link to="/schema">← Back to Schema</Link>
            </Button>
          </div>
          {classData.comment && (
            <p className="mt-2 text-muted-foreground">{classData.comment}</p>
          )}
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Inherits from</h2>
            <ul className="list-disc ml-6 space-y-2">
              {classData.subClassOf.map((parent) => (
                <li key={parent}>
                  {parent.startsWith('http://') ? (
                    <a 
                      href={parent} 
                      className="text-blue-600 hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {parent}
                    </a>
                  ) : (
                    <Link to={`/classes/${parent}`} className="text-blue-600 hover:underline">
                      {parent}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
          
          {subClasses.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Direct Subclasses</h2>
              <ul className="list-disc ml-6 space-y-2">
                {subClasses.map((subClass) => (
                  <li key={subClass.name}>
                    <Link to={`/classes/${subClass.name}`} className="text-blue-600 hover:underline">
                      {subClass.label || subClass.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold mb-4">Properties</h2>
            
            {propertiesByClass.map(([className, properties], index) => (
              <div key={className} className="mb-6">
                <h3 className="text-lg font-medium mb-2">Properties of {className}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted border-b">
                        <th className="text-left p-2">Property</th>
                        <th className="text-left p-2">Expected Type</th>
                        <th className="text-left p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((prop: any) => (
                        <tr key={prop.name} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            <Link to={`/properties/${prop.name}`} className="text-blue-600 hover:underline">
                              {prop.name}
                            </Link>
                          </td>
                          <td className="p-2">
                            {prop.data.range.map((type: string, i: number) => (
                              <span key={type}>
                                {i > 0 && " or "}
                                {type.startsWith("http://") ? (
                                  <a href={type} className="text-blue-600 hover:underline">
                                    {type.split("/").pop()}
                                  </a>
                                ) : (
                                  <Link to={`/classes/${type}`} className="text-blue-600 hover:underline">
                                    {type}
                                  </Link>
                                )}
                              </span>
                            ))}
                          </td>
                          <td className="p-2">{prop.data.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>

          <ApiCard type="class" name={className} />

          <SchemaExamples 
            type="Class"
            name={className}
            label={classData.label}
            comment={classData.comment}
            properties={classData.properties}
            baseUrl="http://oerschema.org/"
          />
        </div>
      </main>
    </div>
  );
}