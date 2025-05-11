import React from "react";
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
    <div className="py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <header className="mb-6 md:mb-8 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{className}</h1>
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link to="/schema">← Back to Schema</Link>
            </Button>
          </div>
          {classData.comment && (
            <p className="mt-3 md:mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl">{classData.comment}</p>
          )}
        </header>

        <div className="grid gap-6 md:gap-8">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-md pt-0">
            <div className="border-b bg-muted/50 px-4 md:px-6 rounded-t-xl pt-6 pb-6">
              <h2 className="font-semibold text-xl md:text-2xl">Class Details</h2>
            </div>
            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              {classData.subClassOf.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Parent Classes</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    {classData.subClassOf.map((parent) => (
                      <li key={parent} className="mt-1">
                        {parent.startsWith('http://') ? (
                          <a 
                            href={parent} 
                            className="text-primary hover:underline break-words"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {parent}
                          </a>
                        ) : (
                          <Link to={`/classes/${parent}`} className="text-primary hover:underline">
                            {parent}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {subClasses.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Direct Subclasses</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    {subClasses.map((subClass) => (
                      <li key={subClass.name} className="mt-1">
                        <Link to={`/classes/${subClass.name}`} className="text-primary hover:underline">
                          {subClass.label || subClass.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {propertiesByClass.length > 0 && (
            <div className="bg-card text-card-foreground flex flex-col rounded-xl border shadow-md mt-4 md:mt-6 pt-0">
              <div className="border-b bg-muted/50 px-4 md:px-6 rounded-t-xl pt-6 pb-6">
                <h2 className="font-semibold text-xl md:text-2xl">Properties</h2>
                <div className="text-muted-foreground text-sm">Properties for {className} and its parent classes.</div>
              </div>
              <div className="">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                        <th className="text-foreground h-10 px-2 align-middle whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold">Property</th>
                        <th className="text-foreground h-10 align-middle whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold">Expected Type</th>
                        <th className="text-foreground h-10 align-middle whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {propertiesByClass.map(([className, properties], index) => (
                        <React.Fragment key={className}>
                          <tr className="data-[state=selected]:bg-muted border-b transition-colors border-t border-border bg-muted/50 hover:bg-muted/50">
                            <td 
                              className="p-2 align-middle whitespace-nowrap bg-muted/80 px-4 py-2 text-left text-sm font-semibold sm:px-6" 
                              colSpan={3}
                            >
                              Properties of <Link to={`/classes/${className}`} className="text-primary hover:underline">{className}</Link>
                            </td>
                          </tr>
                          {(properties as any[]).map((prop: any) => (
                            <tr key={prop.name} className="data-[state=selected]:bg-muted border-b transition-colors hover:bg-muted/50">
                              <td className="p-2 align-middle whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                                <Link to={`/properties/${prop.name}`} className="text-primary hover:underline">
                                  {prop.name}
                                </Link>
                              </td>
                              <td className="p-2 align-middle whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                                {prop.data.range.map((type: string, i: number) => (
                                  <span key={type}>
                                    {i > 0 && " or "}
                                    {type.startsWith("http://") ? (
                                      <a href={type} className="text-primary hover:underline">
                                        {type.split("/").pop()}
                                      </a>
                                    ) : (
                                      <Link to={`/classes/${type}`} className="text-primary hover:underline">
                                        {type}
                                      </Link>
                                    )}
                                  </span>
                                ))}
                              </td>
                              <td className="p-2 align-middle px-3 py-4 text-sm text-muted-foreground">
                                {prop.data.comment}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-md mt-4 md:mt-6 pt-0">
            <div className="border-b bg-muted/50 px-4 md:px-6 rounded-t-xl pt-6 pb-6">
              <h2 className="font-semibold text-xl md:text-2xl">API Access</h2>
              <div className="text-muted-foreground text-sm">Access this class through the API</div>
            </div>
            <div className="p-4 md:p-6">
              <ApiCard type="class" name={className} />
            </div>
          </div>

          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-md mt-4 md:mt-6 pt-0">
            <div className="border-b bg-muted/50 px-4 md:px-6 rounded-t-xl pt-6 pb-6">
              <h2 className="font-semibold text-xl md:text-2xl">Examples</h2>
            </div>
            <div className="p-4 md:p-6">
              <SchemaExamples 
                type="Class"
                name={className}
                label={classData.label}
                comment={classData.comment}
                properties={classData.properties}
                baseUrl="http://oerschema.org/"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}