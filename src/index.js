/*
  Using Cloudflare Workers to add a specific HTTP response header depending on user-agent
*/

// Saving the pattern we want to find/test against as a lowercased string. We will be using .includes() and not RegExp for performance reasons.
const userAgentPattern = 'googlebot';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const handleRequest = async (request) => {
  // Save the request as a new Request
  request = new Request(request);

  // Store the URL as a constant, so we can mutate it
  const url = new URL(request.url);

  // Change the host to point to example.com, for testing
  url.host = 'example.com';

  // // Save the user-agent string to a const
  const userAgent = request.headers.get('User-Agent') || '';

  // // Request (from origin): Test user-agent against pattern, all forced lowercase - output will be either true or false
  request.headers.set('x-googlebot-check', userAgent.toLowerCase().includes(userAgentPattern));

  // For testing purposes, we also want to expose the header within the Response, so we can see something
  response = await fetch(url, request);

  // Store the response, so we can manipulate the headers
  response = new Response(response.body, response)
  
  // Response (to user-agent): Test user-agent against pattern, all forced lowercase - output will be either true or false
  response.headers.set('x-googlebot-check', userAgent.toLowerCase().includes(userAgentPattern));

  return response;
}