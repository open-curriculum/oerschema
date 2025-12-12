import React from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { schema } from "~/lib/schema";
import { SchemaTree } from "~/components/schema-tree";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export async function loader() {
  // Transform schema data for rendering
  const classes = Object.entries(schema.classes).map(([name, data]) => ({
    name,
    ...data
  }));

  const properties = Object.entries(schema.properties).map(([name, data]) => ({
    name,
    ...data
  }));

  return json({
    classes,
    properties
  });
}

export default function SchemaPage() {
  const { classes, properties } = useLoaderData<typeof loader>();
  
  return (
    <div className="py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <header className="mb-6 md:mb-8 border-b pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Schema</h1>
          </div>
          <p className="mt-3 md:mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl">
            Browse the OER Schema vocabulary structure, including classes and properties
          </p>
        </header>

        <div className="grid gap-6 md:gap-8">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-lg">
            <div className="p-4 md:p-6">
              <Tabs defaultValue="classes">
                <TabsList className="mb-6">
                  <TabsTrigger value="classes">Classes</TabsTrigger>
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="hierarchy">Class Hierarchy</TabsTrigger>
                </TabsList>
                
                <TabsContent value="classes" className="mt-2">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm border border-border">
                      <thead className="[&_tr]:border-b">
                        <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                          <th className="text-foreground h-10 px-2 align-middle whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold">Class</th>
                          <th className="text-foreground h-10 px-3 align-middle whitespace-nowrap py-3.5 text-left text-sm font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {classes.map((cls) => (
                          <tr 
                            key={cls.name} 
                            className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                          >
                            <td className="p-2 align-middle whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                              <Link 
                                to={`/classes/${cls.name}`} 
                                className="text-primary hover:underline"
                              >
                                {cls.label || cls.name}
                              </Link>
                            </td>
                            <td className="p-2 align-middle py-4 px-3 text-sm text-muted-foreground">
                              {cls.comment || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="properties" className="mt-2">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm border border-border">
                      <thead className="[&_tr]:border-b">
                        <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                          <th className="text-foreground h-10 px-2 align-middle whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold">Property</th>
                          <th className="text-foreground h-10 px-3 align-middle whitespace-nowrap py-3.5 text-left text-sm font-semibold">Domain</th>
                          <th className="text-foreground h-10 px-3 align-middle whitespace-nowrap py-3.5 text-left text-sm font-semibold">Range</th>
                          <th className="text-foreground h-10 px-3 align-middle whitespace-nowrap py-3.5 text-left text-sm font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {properties.map((prop) => (
                          <tr 
                            key={prop.name} 
                            className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                          >
                            <td className="p-2 align-middle whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                              <Link 
                                to={`/properties/${prop.name}`} 
                                className="text-primary hover:underline"
                              >
                                {prop.label || prop.name}
                              </Link>
                            </td>
                            <td className="p-2 align-middle py-4 px-3 text-sm text-muted-foreground whitespace-nowrap">
                              {prop.domain && prop.domain.length > 0 ? (
                                prop.domain.map((domain, i) => (
                                  <React.Fragment key={domain}>
                                    {i > 0 && ", "}
                                    {domain.startsWith("http://") ? (
                                      <a 
                                        href={domain} 
                                        className="text-primary hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {domain.split('/').pop()}
                                      </a>
                                    ) : (
                                      <Link 
                                        to={`/classes/${domain}`} 
                                        className="text-primary hover:underline"
                                      >
                                        {domain}
                                      </Link>
                                    )}
                                  </React.Fragment>
                                ))
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="p-2 align-middle py-4 px-3 text-sm text-muted-foreground whitespace-nowrap">
                              {prop.range && prop.range.length > 0 ? (
                                prop.range.map((range, i) => (
                                  <React.Fragment key={range}>
                                    {i > 0 && ", "}
                                    {range.startsWith("http://") ? (
                                      <a 
                                        href={range} 
                                        className="text-primary hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {range.split('/').pop()}
                                      </a>
                                    ) : (
                                      <Link 
                                        to={`/classes/${range}`} 
                                        className="text-primary hover:underline"
                                      >
                                        {range}
                                      </Link>
                                    )}
                                  </React.Fragment>
                                ))
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="p-2 align-middle py-4 px-3 text-sm text-muted-foreground">
                              {prop.comment || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="hierarchy" className="mt-2">
                  <div className="border border-border rounded-md p-4 max-h-[70vh] overflow-auto">
                    <SchemaTree />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}