import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { schema } from "~/lib/schema";
import { 
  classToJsonLd, 
  classToXml, 
  classToTurtle, 
  classToJsonSchema,
  classToNTriples,
  classToRDFa,
  classToMicrodata
} from "~/lib/format-converters";

// Make sure the server handles OPTIONS requests for CORS preflight
export const action = async ({ request }: { request: Request }) => {
  if (request.method.toLowerCase() === "options") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept"
      }
    });
  }
  
  return json({ error: "Method not allowed" }, { status: 405 });
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const className = params.name;
  const classData = schema.classes[className as string];

  if (!classData) {
    throw new Response("Class not found", { status: 404 });
  }

  const acceptHeader = request.headers.get("Accept") || "";
  const baseUrl = new URL(request.url).origin + "/";
  
  // Set default content type headers
  const responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept"
  };

  // Basic JSON mode - return directly through Remix's json helper
  if (acceptHeader.includes("application/json")) {
    return json({ className, ...classData }, { headers: responseHeaders });
  }
  
  // Content negotiation for other formats
  if (acceptHeader.includes("application/ld+json")) {
    return new Response(classToJsonLd(className as string, classData, { baseUrl, pretty: true }), {
      headers: {
        ...responseHeaders,
        "Content-Type": "application/ld+json"
      }
    });
  } else if (acceptHeader.includes("application/schema+json")) {
    return new Response(classToJsonSchema(className as string, classData, { baseUrl, pretty: true }), {
      headers: {
        ...responseHeaders,
        "Content-Type": "application/schema+json"
      }
    });
  } else if (acceptHeader.includes("application/xml") || acceptHeader.includes("text/xml")) {
    return new Response(classToXml(className as string, classData, { baseUrl }), {
      headers: {
        ...responseHeaders,
        "Content-Type": "application/xml; charset=utf-8"
      }
    });
  } else if (acceptHeader.includes("text/turtle")) {
    return new Response(classToTurtle(className as string, classData, { baseUrl }), {
      headers: {
        ...responseHeaders,
        "Content-Type": "text/turtle"
      }
    });
  } else if (acceptHeader.includes("application/n-triples")) {
    return new Response(classToNTriples(className as string, classData, { baseUrl }), {
      headers: {
        ...responseHeaders,
        "Content-Type": "application/n-triples"
      }
    });
  } else if (acceptHeader.includes("text/html+rdfa") || acceptHeader.includes("application/rdfa")) {
    return new Response(classToRDFa(className as string, classData, { baseUrl }), {
      headers: {
        ...responseHeaders,
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  } else if (acceptHeader.includes("text/html+microdata") || acceptHeader.includes("application/microdata")) {
    return new Response(classToMicrodata(className as string, classData, { baseUrl }), {
      headers: {
        ...responseHeaders,
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  }

  // Default fallback - return JSON
  return json({ className, ...classData }, { headers: responseHeaders });
}