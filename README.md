# w4156-app
An app making use of our custom job search API.

The deployed version of this app to see how it functions can be found at:

  http://34.69.114.32/

Anywhere in script.js you find a fetch call, change the address/port the API is running on if necessary.
The default is http://localhost:18080.

Implemented:  Index page, job match results, user registration, create job listing.

# CORS and nginx proxy

In order to have the app interface correctly with the API, you will need to download the nginx proxy:

  https://kinsta.com/knowledgebase/install-nginx/

Once installed, edit/create the configuration file at:

  /etc/nginx/sites-available/both (Linux)
  
  /opt/homebrew/etc/nginx/nginx.conf (macOS)

The config file should include the following:

```
server {
        listen       80;
        server_name  localhost;

  location / {
      limit_except GET POST PATCH OPTIONS {
          allow all;
      }
  
      # Handle OPTIONS requests
      if ($request_method = 'OPTIONS') {
          add_header Access-Control-Allow-Origin "http://localhost:8000";
          add_header Access-Control-Allow-Methods "GET, POST, PATCH, OPTIONS";
          add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-API-Key";
          add_header Access-Control-Allow-Credentials "true";
          add_header Content-Length 0;
          add_header Content-Type text/plain;
          return 204;
      }
  
      proxy_pass http://localhost:18080;
      add_header Access-Control-Allow-Origin "http://localhost:8000";
      add_header Access-Control-Allow-Methods "GET, POST, PATCH, OPTIONS";
      add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-API-Key";
      add_header Access-Control-Allow-Credentials "true";
  }
}
```

The server_name is either your local machine or the IP/web address of your site.

The listening port can be 80 (standard http port). The Origin in the headers should
be the address/port where your web site/app is running, and the proxy_pass should be
the location of the API (in this case the same machine on port 18080).

This has the effect of letting nginx handle OPTIONS requests, which Crow has trouble
with, while passing all other requests with the correct CORS headers on to Crow to
handle.

  
