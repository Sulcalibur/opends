/**
 * CORS Middleware
 * Handles Cross-Origin Resource Sharing for API requests
 */

export default defineEventHandler((event) => {
  // Get allowed origins from environment
  // In production, default to allowing all origins (*) if not specified
  // In development, restrict to localhost
  const defaultOrigins = process.env.NODE_ENV === 'production' 
    ? '*'
    : 'http://localhost:3000,http://localhost:9001,http://127.0.0.1:9001,http://localhost';
  
  const allowedOrigins = (process.env.CORS_ORIGIN || defaultOrigins)
    .split(",")
    .map((origin) => origin.trim());

  const origin = getRequestHeader(event, "origin");

  // Check if origin is allowed
  if (
    origin &&
    (allowedOrigins.includes("*") || allowedOrigins.includes(origin))
  ) {
    setResponseHeaders(event, {
      "Access-Control-Allow-Origin": allowedOrigins.includes("*") ? "*" : origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, X-API-Key",
      "Access-Control-Allow-Credentials": allowedOrigins.includes("*") ? undefined : "true",
      "Access-Control-Max-Age": "86400", // 24 hours
    });
  }

  // Handle preflight requests
  if (event.method === "OPTIONS") {
    setResponseStatus(event, 204);
    return "";
  }
});
