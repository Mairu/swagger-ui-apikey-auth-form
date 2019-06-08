export default (React) => (Original, system) => (props) => {
  const { getComponent } = props;
  const { getConfigs, preauthorizeApiKey } = system;
  const ApiKeyAuthForm = getComponent('apiKeyAuthForm');
  const scheme = (props.schema.get('scheme') || '').toLowerCase();

  return (
    <div>
      <Original {...props} />
      {scheme === 'bearer' && (
        <ApiKeyAuthForm
          getConfigs={getConfigs}
          preauthorizeApiKey={preauthorizeApiKey}
          {...props}
        />
      )}
    </div>
  );
};
