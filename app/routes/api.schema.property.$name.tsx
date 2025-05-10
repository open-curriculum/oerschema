import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { schema } from "~/lib/schema";
import { 
  propertyToJsonLd, 
  propertyToXml, 
  propertyToTurtle,
  propertyToJsonSchema,
  propertyToNTriples,
  propertyToRDFa,
  propertyToMicrodata
} from "~/lib/format-converters";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const propertyName = params.name;
  const propertyData = schema.properties[propertyName as string];

  if (!propertyData) {
    throw new Response("Property not found", { status: 404 });
  }

  const acceptHeader = request.headers.get("Accept") || "application/json";
  const baseUrl = new URL(request.url).origin + "/";

  // Content negotiation
  if (acceptHeader.includes("application/ld+json")) {
    return new Response(propertyToJsonLd(propertyName as string, propertyData, { baseUrl, pretty: true }), {
      headers: {
        "Content-Type": "application/ld+json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("application/schema+json")) {
    return new Response(propertyToJsonSchema(propertyName as string, propertyData, { baseUrl, pretty: true }), {
      headers: {
        "Content-Type": "application/schema+json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("application/xml") || acceptHeader.includes("text/xml")) {
    return new Response(propertyToXml(propertyName as string, propertyData, { baseUrl }), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("text/turtle")) {
    return new Response(propertyToTurtle(propertyName as string, propertyData, { baseUrl }), {
      headers: {
        "Content-Type": "text/turtle",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("application/n-triples")) {
    return new Response(propertyToNTriples(propertyName as string, propertyData, { baseUrl }), {
      headers: {
        "Content-Type": "application/n-triples",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("text/html+rdfa") || acceptHeader.includes("application/rdfa")) {
    return new Response(propertyToRDFa(propertyName as string, propertyData, { baseUrl }), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("text/html+microdata") || acceptHeader.includes("application/microdata")) {
    return new Response(propertyToMicrodata(propertyName as string, propertyData, { baseUrl }), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else {
    // Default to JSON
    return new Response(
      JSON.stringify({ propertyName, ...propertyData }, null, 2), 
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}