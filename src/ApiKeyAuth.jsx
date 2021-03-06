export default (React) => (Original, system) => (props) => {
  const { getComponent } = props;
  const { getConfigs, preauthorizeApiKey } = system;
  const ApiKeyAuthForm = getComponent('apiKeyAuthForm');

  return (
    <div>
      <Original {...props} />
      <ApiKeyAuthForm
        getConfigs={getConfigs}
        preauthorizeApiKey={preauthorizeApiKey}
        {...props}
      />
    </div>
  );
};
