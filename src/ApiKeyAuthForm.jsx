import React, { Component } from 'react';
import PropTypes from 'prop-types';

const defaultConfig = {
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
  submitBtnLabel: 'Get Key with Credentials',
};

export default class ApiKeyAuthForm extends Component {
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

    if (pluginConfig && typeof pluginConfig[name] === 'object') {
      Object.assign(config, defaultConfig, pluginConfig[name]);
      showForm = true;
      Object.keys(config.fields).forEach(name => values[name] = '');
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

    if (!(showForm && this.getValue() !== null)) {
      return null;
    }

    const { fields, submitBtnLabel } = config;

    const Input = getComponent('Input');
    const Row = getComponent('Row');
    const Col = getComponent('Col');
    const Button = getComponent('Button');

    return <div>
      {Object.entries(fields).map(([name, fieldProps]) => {
        const {
          label = 'Label',
          type = 'text',
          rowProps = {},
          labelProps = {},
          colProps = {},
          inputProps = {}
        } = fieldProps;

        const valueProps = {};
        if (type === 'checkbox' || type === 'radio') {
          valueProps.checked = values[name];
        } else {
          valueProps.value = values[name];
        }

        return (
          <Row key={name} {...rowProps}>
            <label {...labelProps}>{label}:</label>
            <Col {...colProps}><Input name={name} type={type} {...inputProps} onChange={this.setFieldValue} /></Col>
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
