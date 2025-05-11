import React from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { schema } from "~/lib/schema";
import { Button } from "~/components/ui/button";
import { SchemaExamples } from "~/components/schema-examples";
import { ApiCard } from "~/components/api-card";

export async function loader({ params }: LoaderFunctionArgs) {
  const propertyName = params.name;
  const propertyData = schema.properties[propertyName as string];

  if (!propertyData) {
    throw new Response("Not Found", { status: 404 });
  }

  // Find all classes that have this property
  const classesWithProperty = Object.entries(schema.classes)
    .filter(([_, data]) => data.properties.includes(propertyName as string))
    .map(([name, data]) => ({ name, label: data.label }));

  return json({ propertyData, propertyName, classesWithProperty });
}

export default function PropertyPage() {
  const { propertyData, propertyName, classesWithProperty } = useLoaderData<typeof loader>();

  return (
    <div className="py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <header className="mb-6 md:mb-8 border-b pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Property: {propertyName}
            </h1>
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link to="/schema">← Back to Schema</Link>
            </Button>
          </div>
          {propertyData.comment && (
            <p className="mt-3 md:mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl">{propertyData.comment}</p>
          )}
        </header>

        <div className="grid gap-6 md:gap-8">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-md pt-0">
            <div className="border-b bg-muted/50 px-4 md:px-6 rounded-t-xl pt-6 pb-6">
              <h2 className="font-semibold text-xl md:text-2xl">Property Details</h2>
            </div>
            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              <div>
                <h3 className="font-semibold text-lg">ID</h3>
                <p className="text-muted-foreground">{propertyName}</p>
              </div>

              {propertyData.label && (
                <div>
                  <h3 className="font-semibold text-lg">Label</h3>
                  <p className="text-muted-foreground">{propertyData.label}</p>
                </div>
              )}

              {propertyData.range && propertyData.range.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg">Range</h3>
                  <ul className="list-disc pl-6">
                    {propertyData.range.map((type) => (
                      <li key={type} className="mt-1 break-words">
                        {type.startsWith('http://') ? (
                          <a 
                            href={type} 
                            className="text-primary hover:underline break-words"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {type}
                          </a>
                        ) : (
                          <Link to={`/classes/${type}`} className="text-primary hover:underline">
                            {type}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {propertyData.domain && propertyData.domain.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg">Domain</h3>
                  <ul className="list-disc pl-6">
                    {propertyData.domain.map((domain) => (
                      <li key={domain} className="mt-1 break-words">
                        {domain.startsWith('http://') ? (
                          <a 
                            href={domain} 
                            className="text-primary hover:underline break-words"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {domain}
                          </a>
                        ) : (
                          <Link to={`/classes/${domain}`} className="text-primary hover:underline">
                            {domain}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {classesWithProperty.length > 0 && (
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-md mt-4 md:mt-6 pt-0">
              <div className="border-b bg-muted/50 px-4 md:px-6 rounded-t-xl pt-6 pb-6">
                <h2 className="font-semibold text-xl md:text-2xl">Classes Using This Property</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {classesWithProperty.map((cls) => (
                    <Link
                      key={cls.name}
                      to={`/classes/${cls.name}`}
                      className="p-3 border rounded-md hover:bg-muted transition-colors flex items-center gap-2 break-words"
                    >
                      <span className="text-primary">{cls.label || cls.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-md mt-4 md:mt-6 pt-0">
            <div className="border-b bg-muted/50 px-4 md:px-6 rounded-t-xl pt-6 pb-6">
              <h2 className="font-semibold text-xl md:text-2xl">API Access</h2>
              <div className="text-muted-foreground text-sm">Access this property through the API</div>
            </div>
            <div className="p-4 md:p-6">
              <ApiCard type="property" name={propertyName} />
            </div>
          </div>

          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-md mt-4 md:mt-6 pt-0">
            <div className="border-b bg-muted/50 px-4 md:px-6 rounded-t-xl pt-6 pb-6">
              <h2 className="font-semibold text-xl md:text-2xl">Examples</h2>
            </div>
            <div className="p-4 md:p-6">
              <SchemaExamples 
                type="Property"
                name={propertyName}
                label={propertyData.label}
                comment={propertyData.comment}
                range={propertyData.range}
                baseUrl="http://oerschema.org/"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}