import PropTypes from 'prop-types';

const defaultConfig = {
  containerStyle: {
    marginLeft: 20
  },
  fields: {
    username: {
      type: 'text',
      label: 'Username',
      initialValue: '',
    },
    password: {
      type: 'password',
      label: 'Password',
      initialValue: '',
    },
  },
  submitBtnLabel: 'Get Key with Credentials',
};

export default (React) => class ApiKeyAuthForm extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    preauthorizeApiKey: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    const { name, getConfigs } = props;
    const pluginConfig = getConfigs().configs.apiKeyAuthFormPlugin;
    const config = {};
    const values = {};
    let showForm = false;

    if (pluginConfig && pluginConfig.forms && typeof pluginConfig.forms[name] === 'object') {
      Object.assign(config, defaultConfig, pluginConfig.forms[name]);
      showForm = true;
      Object.entries(config.fields).forEach(([fieldName, { initialValue }]) => values[fieldName] = initialValue || '');
    }

    this.state = {
      config,
      showForm,
      values,
    };

    this.setFieldValue = this.setFieldValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getValue () {
    let { name, authorized } = this.props;

    return authorized && authorized.getIn([name, 'value']);
  }

  setFieldValue(event) {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox' || type === 'radio') {
      this.setState((prevState) => ({ values: { ...prevState.values, [name]: checked ? value : '' }}));
    } else {
      this.setState((prevState) => ({ values: { ...prevState.values, [name]: value }}));
    }
  }

  handleSubmit() {
    this.setState((prevState) => ({
      ...prevState,
      error: undefined,
    }));

    const { config } = this.state;

    if (config.authCallback) {
      config.authCallback(this.state.values, (err, res) => {
        if (err) {
          this.setState({ error: String(err) });
          return;
        }
        const { name, preauthorizeApiKey } = this.props;

        preauthorizeApiKey(name, res);
      });
    }
  }

  render() {
    const { getComponent } = this.props;
    const { config, showForm, values, error } = this.state;
    const value = this.getValue();

    if (value || !showForm) {
      return null;
    }

    const { containerStyle, fields, submitBtnLabel } = config;

    const Input = getComponent('Input');
    const Row = getComponent('Row');
    const Col = getComponent('Col');
    const Button = getComponent('Button');

    return <div className="auth-container-api-key-form" style={containerStyle}>
      {Object.entries(fields).map(([name, fieldProps]) => {
        const {
          label = 'Label',
          type = 'text',
          rowProps = {},
          labelProps = {},
          colProps = {},
          inputProps: { onChange: onChangeProp, ...inputProps } = {}
        } = fieldProps;

        const valueProps = {};
        if (type === 'checkbox' || type === 'radio') {
          valueProps.checked = values[name];
        } else {
          valueProps.value = values[name];
        }

        const onChange = onChangeProp
          ? (event) => {
            event.persist();
            const result = onChangeProp(event);
            if (result !== false) {
              this.setFieldValue(event);
            }
          }
          : this.setFieldValue;

        return (
          <Row key={name} {...rowProps}>
            <label {...labelProps}>{label}:</label>
            <Col {...colProps}><Input name={name} type={type} {...inputProps} onChange={onChange} /></Col>
          </Row>
        );
      })}
      {error && (
        <div className="errors" style={{ backgroundColor: "#ffeeee", color: "red", margin: "1em" }}>
          <span>{error}</span>
        </div>
      )}
      <Row>
        <Button className="btn modal-btn auth authorize" onClick={this.handleSubmit}>{submitBtnLabel}</Button>
      </Row>
    </div>;
  }
}
