import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectOne from './SelectOne.jsx';

class Popup extends Component {
  constructor() {
    super();
    this.state = {
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
  }

  isValid() {
    if (this.props.selectedConnection.ip && this.props.selectedConnection.port) {
      return true;
    }
    chrome.tabs.create({ url: chrome.extension.getURL('options.html') });
    return false;
  }

  sendToKodi() {
    if (!this.isValid()) {
      return;
    }
    this.setState({ loading: true });
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
            btoa(this.props.selectedConnection.login + ':' + this.props.selectedConnection.pw)
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
          throw Error(json.error);
        }
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
      <div style={{ width: '300px' }}>
        <textarea
          className="form-control"
          rows="3"
          value={this.state.url}
          onChange={event => this.handleInputChange(event)}
        />
        <div className="row m-1">
          <div className="col-9">
            <SelectOne
              connections={this.props.connections}
              selectedConnection={this.props.selectedConnection}
              saveSelectedConnection={selectedConnection =>
                this.props.saveSelectedConnection(selectedConnection, true)}
            />
          </div>
          <div className="col-3">
            <button
              className="btn btn-light"
              disabled={this.state.loading}
              onClick={() => this.sendToKodi()}
            >
              {this.state.loading ? (
                <i className="fa fa-spinner fa-pulse fa-1x" />
              ) : (
                <i className="fa fa-play fa-1x" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Popup.propTypes = {
  saveSelectedConnection: PropTypes.func,
  selectedConnection: PropTypes.shape({
    id: PropTypes.Date,
    name: PropTypes.string,
    ip: PropTypes.string,
    port: PropTypes.string,
    login: PropTypes.string,
    pw: PropTypes.string
  }),
  connections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.Date,
      name: PropTypes.string,
      ip: PropTypes.string,
      port: PropTypes.string,
      login: PropTypes.string,
      pw: PropTypes.string
    })
  )
};

export default Popup;
