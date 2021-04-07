/*
  Using Cloudflare workers to implement a migration, where the redirects are performed by the Cloudflare Worker opposed to being done by the origin server.
*/

const redirectsObj = {
  '/xx-xx/hello-world':{to: '/xx-xx/ciao-mars'}
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const handleRequest = async (request) => {
  const url = new URL(request.url);

  if(redirectsObj.hasOwnProperty(url.pathname)){
    const redirDestination = redirectsObj[url.pathname].to;
    const redirUrl = redirDestination.substring(0,4) === 'http' ? redirDestination :  'https://'  +url.host + redirDestination;
    return Response.redirect(redirUrl, 301);
  }

  /* Disabled for now, as there are no resources - But you can make it pass-through by just requesting the origin or have a catch-all redirect
    // Return a normal response, grabbing the original request
    return fetch(request);
  */
  return new Response(
    `
      <h1>Welcome!</h1><p>To view a redirect, please make a request to /xx-xx/hello-world</p>
    `,
    {
      status:200,
      headers:{
        'content-type':'text/html',
        'x-robots-tag':'noindex'
      }
    }
  );
}