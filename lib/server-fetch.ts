/**
 * Server-side fetch utility that handles self-signed SSL certificates
 * 
 * This is needed because Node.js (used in Next.js server components)
 * doesn't trust self-signed certificates by default.
 * 
 * Note: This should only be used for self-signed certificates.
 * For production with proper certificates, use regular fetch.
 */

import https from "https";

// Create an HTTPS agent that accepts self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Accept self-signed certificates
});

/**
 * Server-side fetch that accepts self-signed SSL certificates
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options (same as regular fetch)
 * @returns Promise<Response>
 */
export async function serverFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Only use the custom agent for HTTPS URLs
  if (url.startsWith("https://")) {
    // @ts-ignore - Node.js fetch supports agent option
    return fetch(url, {
      ...options,
      // @ts-ignore
      agent: httpsAgent,
    });
  }

  // For HTTP URLs, use regular fetch
  return fetch(url, options);
}
