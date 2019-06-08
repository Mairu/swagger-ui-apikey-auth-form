const getDefaultKey = name => `SwUI_apiKeyAuth_${name}_${window.location.host}${window.location.pathname}`;

export function saveToLocalStorage(config, name, value) {
  if (typeof config[name] === 'object') {
    const { key = getDefaultKey(name), ttl = 3600 } = config[name];

    localStorage.setItem(key, JSON.stringify({
      value,
      expiredAt: Date.now() + (ttl * 1000),
    }));
  }
}

export function removeToLocalStorage(config, name) {
  if (typeof config[name] === 'object') {
    const { key = getDefaultKey(name) } = config[name];

    localStorage.removeItem(key);
  }
}

// additional trigger save of localStorage
export function preauthorizeApiKey(original, save, name, value) {
  save(name, value);
  original(name, value);
}

export function loadFromLocalStorage(preauthorizeApiKey, config) {
  Object.entries(config).forEach(([name, entryConfig = {}]) => {
    const { key = getDefaultKey(name) } = entryConfig;

    const entry = localStorage.getItem(key);
    if (!entry) {
      return;
    }

    const { value, expiredAt } = JSON.parse(entry);
    if (expiredAt < Date.now()) {
      localStorage.removeItem(key);
    } else {
      preauthorizeApiKey(name, value);
    }
  });
}
