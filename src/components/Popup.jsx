import React, { Component } from 'react';

class Popup extends Component {
  constructor() {
    super();
    this.state = {
      ip: '',
      port: '',
      login: '',
      pw: '',
      status: '',
      url: ''
    };
  }

  handleInputChange(event) {
    this.setState({ url: event.target.value });
  }

  componentWillMount() {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      this.setState({ url: tabs[0].url });
    });
    chrome.storage.sync.get('settings', result => {
      if (Object.values(result).length) {
        const s = result.settings;
        this.setState({ ip: s.ip, port: s.port, login: s.login, pw: s.pw });
      }
    });
  }

  sendToKodi() {
    fetch('http://' + this.state.ip + ':' + this.state.port + '/jsonrpc', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(this.state.pw + ':' + this.state.login)
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'Player.Open',
        id: 0,
        params: {
          item: {
            file: 'plugin://plugin.video.sendtokodi/?' + this.state.url
          }
        }
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error('Unauthorized');
      })
      .then(json => {
        console.log(json);
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
        <textarea
          className="form-control"
          rows="3"
          style={{ width: '300px' }}
          value={this.state.url}
          onChange={event => this.handleInputChange(event)}
        />
        <div className="float-right m-1">
          <span>{this.state.status}</span>
          <button
            className="btn btn-secondary"
            onClick={() => this.sendToKodi()}
          >
            SendToKodi
          </button>
        </div>
      </div>
    );
  }
}

export default Popup;
