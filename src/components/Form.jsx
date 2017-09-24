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
    fetch(
      'http://' +
        this.props.selectedConnection.ip +
        ':' +
        this.props.selectedConnection.port +
        '/jsonrpc',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' +
            btoa(this.props.selectedConnection.pw + ':' + this.props.selectedConnection.login)
        },
        body: JSON.stringify({
          method: 'Addons.GetAddonDetails',
          id: 0,
          jsonrpc: '2.0',
          params: { addonid: 'plugin.video.sendtokodi' }
        })
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error('Unauthorized');
      })
      .then(json => {
        if (json.error) {
          throw Error('Kodi Plugin not found');
        }
        if (
          json.result &&
          json.result.addon &&
          json.result.addon.addonid === 'plugin.video.sendtokodi'
        ) {
          return this.setStatus('Connected');
        }
        throw Error('Kodi Plugin not found');
      })
      .catch(error => this.setStatus(error.message));
  }

  setStatus(message) {
    this.setState({ status: message });
    setTimeout(() => this.setState({ status: '' }), 5000);
  }

  handleInputChange(event) {
    let selectedConnection = { ...this.props.selectedConnection };
    selectedConnection[event.target.name] = event.target.value;
    this.props.saveSelectedConnection(selectedConnection);
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
            onChange={e => this.handleInputChange(e)}
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
            onChange={e => this.handleInputChange(e)}
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
            onChange={e => this.handleInputChange(e)}
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
            onChange={e => this.handleInputChange(e)}
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
            onChange={e => this.handleInputChange(e)}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-secondary" onClick={() => this.props.saveForm()}>
            Save
          </button>{' '}
          <button className="btn btn-secondary" onClick={() => this.testConnection()}>
            Test
          </button>{' '}
          <p>{this.state.status}</p>
        </div>
      </div>
    );
  }
}

Form.propTypes = {
  saveSelectedConnection: PropTypes.func,
  saveForm: PropTypes.func,
  selectedConnection: PropTypes.shape({
    name: PropTypes.string,
    ip: PropTypes.string,
    port: PropTypes.string,
    login: PropTypes.string,
    pw: PropTypes.string
  })
};

export default Form;
