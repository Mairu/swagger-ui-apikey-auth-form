import createApiKeyAuth from './ApiKeyAuth'
import createHttpAuth from './HttpAuth'
import createApiKeyAuthForm from './ApiKeyAuthForm'
import { loadFromLocalStorage, preauthorizeApiKey, removeToLocalStorage, saveToLocalStorage } from './localStorage';

export default function (swaggerUi) {
  const { React } = swaggerUi;
  return {
    afterLoad(system) {
      const config = system.getConfigs().apiKeyAuthFormPlugin;
      const localStorageConfig = config && config.localStorage || {};
      this.rootInjects.saveApiKeyAuth = saveToLocalStorage.bind(null, localStorageConfig);
      this.rootInjects.forgetApiKeyAuth = removeToLocalStorage.bind(null, localStorageConfig);
      this.rootInjects.loadSavedApiKeyAuths =
        loadFromLocalStorage.bind(null, this.rootInjects.preauthorizeApiKey, localStorageConfig);
      this.rootInjects.preauthorizeApiKey =
        preauthorizeApiKey.bind(null, this.rootInjects.preauthorizeApiKey, this.rootInjects.saveApiKeyAuth);
    },
    statePlugins: {
      auth: {
        wrapActions: {
          authorize: (oriAction, system) => (payload) => {
            Object.values(payload).forEach(({ name, value }) => {
              system.saveApiKeyAuth(name, value);
            });
            oriAction(payload);
          },
          logout: (oriAction, system) => (payload) => {
            payload.forEach(name => system.forgetApiKeyAuth(name));
            oriAction(payload);
          },
        },
      },
      spec: {
        wrapActions: {
          updateJsonSpec: (oriAction, system) => (payload) => {
            oriAction(payload);
            // found no better entry point to load auths from local storage
            system.loadSavedApiKeyAuths();
          }
        },
      },
    },
    components: {
      apiKeyAuthForm: createApiKeyAuthForm(React),
    },
    wrapComponents: {
      apiKeyAuth: createApiKeyAuth(React),
      HttpAuth: createHttpAuth(React),
    },
  }
}
