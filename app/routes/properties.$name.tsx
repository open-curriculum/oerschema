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

  return json({ propertyData, propertyName });
}

export default function PropertyPage() {
  const { propertyData, propertyName } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{propertyName}</h1>
            <Button variant="outline" size="sm" asChild>
              <Link to="/schema">← Back to Schema</Link>
            </Button>
          </div>
          <p className="mt-2 text-muted-foreground">{propertyData.comment}</p>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <dl className="grid gap-4">
              <div>
                <dt className="font-semibold">Label</dt>
                <dd>{propertyData.label}</dd>
              </div>
              {propertyData.baseVocab && (
                <div>
                  <dt className="font-semibold">Base Vocabulary</dt>
                  <dd>{propertyData.baseVocab}</dd>
                </div>
              )}
              <div>
                <dt className="font-semibold">Range</dt>
                <dd>
                  <ul className="list-disc list-inside">
                    {propertyData.range.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Domain</dt>
                <dd>
                  <ul className="list-disc list-inside">
                    {propertyData.domain.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </section>

          <ApiCard type="property" name={propertyName} />

          <SchemaExamples 
            type="Property"
            name={propertyName}
            label={propertyData.label}
            comment={propertyData.comment}
            range={propertyData.range}
            domain={propertyData.domain}
            baseUrl="http://oerschema.org/"
          />
        </div>
      </main>
    </div>
  );
}