// This file serves as a bridge for Vercel's API routes to the Remix app
import { createRequestHandler } from "@remix-run/node";
import * as build from "../../../build/server/index.js";

export default async function handler(req, res) {
  // Get the name parameter from the URL
  const name = req.query.name;
  
  // Set the proper path for the Remix request
  req.url = `/api/schema/property/${name}`;
  
  // Set up CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  // Pass the request to Remix handler
  return createRequestHandler({
    build,
    mode: process.env.NODE_ENV,
  })(req, res);
}