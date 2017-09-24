import React, { Component } from 'react';

class Popup extends Component {
  constructor() {
    super();
    this.state = {
      ip: '',
      port: '',
      login: '',
      pw: '',
      url: '',
      loading: false
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
    this.setState({ loading: true });
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
        if (json.result === 'OK') {
          window.close();
        }
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
        alert(error.message);
      });
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
        <div className="text-center m-1">
          <button
            className="btn btn-light"
            disabled={this.state.loading}
            onClick={() => this.sendToKodi()}
          >
            {this.state.loading ? (
              <i className="fa fa-spinner fa-pulse fa-2x" />
            ) : (
              <i className="fa fa-play fa-2x" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    );
  }
}

export default Popup;
