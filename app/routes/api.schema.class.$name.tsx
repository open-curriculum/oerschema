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

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const className = params.name;
  const classData = schema.classes[className as string];

  if (!classData) {
    throw new Response("Class not found", { status: 404 });
  }

  const acceptHeader = request.headers.get("Accept") || "";
  const baseUrl = new URL(request.url).origin + "/";
  
  // Common headers for all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept"
  };

  // Check if the request specifically wants JSON
  const jsonRequested = 
    acceptHeader.includes("application/json") || 
    request.headers.get("X-Requested-With") === "XMLHttpRequest";
  
  // JSON format (default or explicitly requested)
  if (jsonRequested || acceptHeader === "*/*" || !acceptHeader) {
    return new Response(
      JSON.stringify({ className, ...classData }, null, 2),
      {
        status: 200,
        headers: {
          ...headers,
          "Content-Type": "application/json; charset=utf-8"
        }
      }
    );
  }
  
  // Handle other content types
  if (acceptHeader.includes("application/ld+json")) {
    return new Response(
      classToJsonLd(className as string, classData, { baseUrl, pretty: true }),
      {
        status: 200,
        headers: {
          ...headers,
          "Content-Type": "application/ld+json"
        }
      }
    );
  } else if (acceptHeader.includes("application/schema+json")) {
    return new Response(classToJsonSchema(className as string, classData, { baseUrl, pretty: true }), {
      headers: {
        ...headers,
        "Content-Type": "application/schema+json"
      }
    });
  } else if (acceptHeader.includes("application/xml") || acceptHeader.includes("text/xml")) {
    return new Response(classToXml(className as string, classData, { baseUrl }), {
      headers: {
        ...headers,
        "Content-Type": "application/xml; charset=utf-8"
      }
    });
  } else if (acceptHeader.includes("text/turtle")) {
    return new Response(classToTurtle(className as string, classData, { baseUrl }), {
      headers: {
        ...headers,
        "Content-Type": "text/turtle"
      }
    });
  } else if (acceptHeader.includes("application/n-triples")) {
    return new Response(classToNTriples(className as string, classData, { baseUrl }), {
      headers: {
        ...headers,
        "Content-Type": "application/n-triples"
      }
    });
  } else if (acceptHeader.includes("text/html+rdfa") || acceptHeader.includes("application/rdfa")) {
    return new Response(classToRDFa(className as string, classData, { baseUrl }), {
      headers: {
        ...headers,
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  } else if (acceptHeader.includes("text/html+microdata") || acceptHeader.includes("application/microdata")) {
    return new Response(classToMicrodata(className as string, classData, { baseUrl }), {
      headers: {
        ...headers,
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  }

  // Default to JSON if no specific format matched
  return new Response(
    JSON.stringify({ className, ...classData }, null, 2),
    {
      status: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json; charset=utf-8"
      }
    }
  );
};