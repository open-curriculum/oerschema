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

export async function loader({ params, request }: LoaderFunctionArgs) {
  const className = params.name;
  const classData = schema.classes[className as string];

  if (!classData) {
    throw new Response("Class not found", { status: 404 });
  }

  const acceptHeader = request.headers.get("Accept") || "application/json";
  const baseUrl = new URL(request.url).origin + "/";

  // Content negotiation
  if (acceptHeader.includes("application/ld+json")) {
    return new Response(classToJsonLd(className as string, classData, { baseUrl, pretty: true }), {
      headers: {
        "Content-Type": "application/ld+json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("application/schema+json")) {
    return new Response(classToJsonSchema(className as string, classData, { baseUrl, pretty: true }), {
      headers: {
        "Content-Type": "application/schema+json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("application/xml") || acceptHeader.includes("text/xml")) {
    return new Response(classToXml(className as string, classData, { baseUrl }), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("text/turtle")) {
    return new Response(classToTurtle(className as string, classData, { baseUrl }), {
      headers: {
        "Content-Type": "text/turtle",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("application/n-triples")) {
    return new Response(classToNTriples(className as string, classData, { baseUrl }), {
      headers: {
        "Content-Type": "application/n-triples",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("text/html+rdfa") || acceptHeader.includes("application/rdfa")) {
    return new Response(classToRDFa(className as string, classData, { baseUrl }), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else if (acceptHeader.includes("text/html+microdata") || acceptHeader.includes("application/microdata")) {
    return new Response(classToMicrodata(className as string, classData, { baseUrl }), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } else {
    // Default to JSON
    return new Response(
      JSON.stringify({ className, ...classData }, null, 2), 
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}