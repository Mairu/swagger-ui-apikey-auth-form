# swagger-ui-apikey-auth-form.js
A plugin for Swagger UI to authenticate using credentials to generate a token which is used as apiKey header. 

## Usage

1. Copy swagger-ui-apikey-auth-form.js into your Swagger project.

2. Include this script in your Swagger index.html

```
<script src="./swagger-ui-apikey-auth-form.js"></script>
```

3. Then add the plugin to you Swagger UI config

```
      const ui = SwaggerUIBundle({
        // ...
        plugins: [
          // ...
          SwaggerUIApiKeyAuthFormPlugin,
        ],
        // ...
      });
```
