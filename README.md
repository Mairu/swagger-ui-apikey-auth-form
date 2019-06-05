# swagger-ui-apikey-auth-form.js
A plugin for Swagger UI to authenticate using credentials to generate a token which is used as apiKey header. 

## Usage

1. Copy swagger-ui-apikey-auth-form.js into your Swagger project.

2. Include this script in your Swagger index.html

```
<script src="./swagger-ui-apikey-auth-form.js"></script>
```

3. Then add the plugin to you Swagger UI config and also add needed configuration

```
      const ui = SwaggerUIBundle({
        // ...
        plugins: [
          // ...
          SwaggerUIApiKeyAuthFormPlugin,
        ],
        // ...
        config: {
          apiKeyAuthFormPlugin: {
            apiKeyName: {
              fields: {
                fieldName: {
                  type: 'text',
                  label: 'Fieldname',
                },
                // ...
              },
              authCallback(values, callback) {
                // do login stuff
                
                // on error
                callback('error message');
                
                // on success
                callback(null, 'the api key here');
              })
            }
          }
        }
      });
```

## API

### fields
Object of fields to render. If not provided the default is used 
```
  fields: {
    username: {
      type: 'text',
      label: 'Username',
    },
    password: {
      type: 'password',
      label: 'Password',
    },
  },
```

every field can have the keys: type, label, rowProps, colProps, labelProps and inputProps

### submitBtnLabel
Simple string with Label for the submit button. Default is: 'Get Key with Credentials'
