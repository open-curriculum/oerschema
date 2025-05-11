// This file was causing issues with normal page rendering
// The middleware has been disabled to fix the white screen issue
// API content negotiation will be handled directly by the loader functions

export default function middleware(request) {
  // Simply pass through all requests without modification
  return undefined; // This causes the middleware to be skipped
}