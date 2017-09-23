import React, { Component } from 'react';

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      ip: '',
      port: '',
      login: '',
      pw: '',
      status: ''
    };
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  componentWillMount() {
    chrome.storage.sync.get('settings', result => {
      if (Object.values(result).length) {
        const s = result.settings;
        this.setState({ ip: s.ip, port: s.port, login: s.login, pw: s.pw });
      }
    });
  }

  save() {
    chrome.storage.sync.set({ settings: this.state });
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
      <div className="container mt-3" style={{ width: '500px' }}>
        <div className="form-group">
          <label htmlFor="ip">IP Adresse</label>
          <input
            className="form-control"
            type="text"
            name="ip"
            placeholder="127.0.0.1"
            id="ip"
            value={this.state.ip}
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
            value={this.state.port}
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
            value={this.state.login}
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
            value={this.state.pw}
            onChange={e => this.handleInputChange(e)}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-secondary" onClick={() => this.save()}>
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

export default Settings;
