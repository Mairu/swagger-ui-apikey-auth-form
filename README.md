# Swagger UI Plugin ApiKeyAuthForm
[![npm](https://img.shields.io/npm/v/@mairu/swagger-ui-apikey-auth-form.svg?logo=npm)](https://www.npmjs.com/package/@mairu/swagger-ui-apikey-auth-form)

A plugin for Swagger UI to authenticate using credentials to generate a token which is used as apiKey header. Works also for bearer authentication of OpenApi V3.
Also keeps an api token in the localStorage if configured, which helps with page reloads (on development).

## Demo
A Demo of Swagger UI using this plugin as available [here](https://mairu.github.io/swagger-ui-apikey-auth-form/demo).
The credentials for the api key authentication are `user` with password `secret`.

## Compatibility
The plugin was developed using Swagger UI Version 3.22. As it uses internal APIs of Swagger UI,
they could change and break the plugin.

## Usage.
1. Make swagger-ui-apikey-auth-form.js available for use in your Swagger UI. There are different possibilities:
    * Load it using https://unpkg.com/@mairu/swagger-ui-apikey-auth-form@1.0.0/dist/swagger-ui-apikey-auth-form.js (directly or copy to your project)
    * Include '@mairu/swagger-ui-apikey-auth-form' to your dependencies and serve it from node_modules.
2. Include this script in your Swagger index.html (adjust the path to the method you use)
```
<script src="./swagger-ui-apikey-auth-form.js"></script>
```

3. Then add the plugin to your Swagger UI config and also add needed configuration

```
      const ui = SwaggerUIBundle({
        // ...
        plugins: [
          // ...
          SwaggerUIApiKeyAuthFormPlugin,
        ],
        // ...
        configs: {
          apiKeyAuthFormPlugin: {
            forms: {
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

                  // example using SwaggerUIs fetch api
                  ui.fn.fetch({
                    url: '/authenticate',
                    method: 'post',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(value),
                  }).then(function (response) {
                    const json = JSON.parse(response.data);
                    if (json.token) {
                      callback(null, 'Bearer ' + json.token);
                    } else {
                      callback('error while login');
                    }
                  }).catch(function (err) {
                    console.log(err, Object.entries(err));
                    callback('error while login');
                  });
                },
              }
            },
            localStorage: {
              apiKeyName: {}
            }
          }
        }
      });
```

## Configuration
The Plugin has to be configured to know for which apiKey a form should be added to the SwaggerUI and how to handle authentication.
For that you have to add the plugin config object in the `configs` of the SwaggerUI initialization with key name `apiKeyAuthFormPlugin`.

Here are the config options of the plugin config:

* **forms**<br>
  To add credentials fields to an api key authentication you have to add this object
  with the name of the security definition of the api key as object key and an object with the following options as sub keys.
  * **authCallback** (required)<br>
    Callback to perform the api key fetching or creation. The callback will get 2 parameters:
    * **values** - object with form values
    * **callback(error, apiKey)** - callback to provide api key or error (string)
  * **containerStyle**<br>
    Object with css in react way for the container that holds the fields and the submit button.
    If not provided the default is used `{ marginLeft: 20 }`
    The container also has the class `auth-container-api-key-form` if other style should be addressed.
  * **fields**<br>
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
  * **submitBtnLabel**<br>
    Simple string with Label for the submit button. Default is: 'Get Key with Credentials'

* **localStorage** - 
  If you want to keep api keys in the local storage you can configure that here.
  It is an object with the name of the security definition of the api key as object key and the following options as sub keys.
  * **key** - 
    Key which is used in localStorage, default would be
    `` `SwUI_apiKeyAuth_${name}_${window.location.host}${window.location.pathname}` ``
  * **ttl** - 
    Time how long an apiKey should be valid when read from localStorage in seconds, default is 3600 (1 hour)
