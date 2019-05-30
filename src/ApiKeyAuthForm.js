import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ApiKeyAuthForm extends Component {
  initializeComponent = (c) => {
    this.el = c
  };

  render() {
    const { className } = this.props;
    return <span className={className}>Test</span>;
  }
}

ApiKeyAuthForm.propTypes = {
  className: PropTypes.string
};
