import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Form extends Component {
  constructor() {
    super();
    this.state = {
      status: ''
    };
  }

  testConnection() {
    fetch('http://' + this.state.ip + ':' + this.state.port + '/jsonrpc', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(this.state.pw + ':' + this.state.login)
      },
      body: JSON.stringify({
        method: 'Addons.GetAddonDetails',
        id: 0,
        jsonrpc: '2.0',
        params: { addonid: 'plugin.video.sendtokodi' }
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error('Unauthorized');
      })
      .then(json => {
        if (json.result.addon.addonid === 'plugin.video.sendtokodi') {
          return this.setStatus('Connected');
        } else {
          throw Error('Kodi Plugin not found');
        }
      })
      .catch(error => this.setStatus(error.message));
  }

  setStatus(message) {
    this.setState({ status: message });
    setTimeout(() => this.setState({ status: '' }), 5000);
  }

  render() {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            className="form-control"
            type="text"
            name="name"
            placeholder="Connection Name"
            id="name"
            value={this.props.selectedConnection.name}
            onChange={e => this.props.handleInputChange(e)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ip">IP Adresse</label>
          <input
            className="form-control"
            type="text"
            name="ip"
            placeholder="127.0.0.1"
            id="ip"
            value={this.props.selectedConnection.ip}
            onChange={e => this.props.handleInputChange(e)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="port">Port</label>
          <input
            className="form-control"
            type="text"
            name="port"
            placeholder="8080"
            id="port"
            value={this.props.selectedConnection.port}
            onChange={e => this.props.handleInputChange(e)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="login">Login</label>
          <input
            className="form-control"
            type="text"
            name="login"
            placeholder="kodi"
            id="login"
            value={this.props.selectedConnection.login}
            onChange={e => this.props.handleInputChange(e)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pw">Password</label>
          <input
            className="form-control"
            type="password"
            name="pw"
            placeholder="kodi"
            id="pw"
            value={this.props.selectedConnection.pw}
            onChange={e => this.props.handleInputChange(e)}
          />
        </div>
        <div className="form-group">
          <button
            className="btn btn-secondary"
            onClick={() => this.props.save()}
          >
            Save
          </button>{' '}
          <button
            className="btn btn-secondary"
            onClick={() => this.testConnection()}
          >
            Test
          </button>{' '}
          <span>{this.state.status}</span>
        </div>
      </div>
    );
  }
}

Form.propTypes = {
  handleInputChange: PropTypes.func,
  save: PropTypes.func,
  selectedConnection: PropTypes.shape({
    name: PropTypes.string,
    ip: PropTypes.string,
    port: PropTypes.string,
    login: PropTypes.string,
    pw: PropTypes.string
  })
};

export default Form;
