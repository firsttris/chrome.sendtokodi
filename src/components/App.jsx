import React, { Component } from 'react';
import Settings from './Settings.jsx';
import Popup from './Popup.jsx';
import PropTypes from 'prop-types';

const newConnection = {
  name: 'Default',
  ip: '',
  port: '',
  login: '',
  pw: ''
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      connections: [newConnection],
      selectedConnection: newConnection
    };
  }

  componentWillMount() {
    chrome.storage.sync.get('connections', result => {
      if (result.connections) {
        this.setState({ connections: result.connections });
      }
    });
    chrome.storage.sync.get('selectedConnection', result => {
      if (result.selectedConnection) {
        this.setState({ selectedConnection: result.selectedConnection });
      }
    });
  }

  saveConnections(connections) {
    this.setState({ connections });
    chrome.storage.sync.set({ connections });
  }

  saveSelectedConnection(selectedConnection, persist) {
    this.setState({ selectedConnection });
    if (persist) {
      chrome.storage.sync.set({ selectedConnection });
    }
  }

  saveSettings(connections, selectedConnection, persist) {
    this.setState({ connections, selectedConnection });
    if (persist) {
      chrome.storage.sync.set({ connections, selectedConnection });
    }
  }

  render() {
    return (
      <div>
        {this.props.page === '/options.html' ? (
          <Settings
            selectedConnection={this.state.selectedConnection}
            connections={this.state.connections}
            saveSelectedConnection={(selectedConnection, persist) =>
              this.saveSelectedConnection(selectedConnection, persist)}
            saveConnections={connections => this.saveConnections(connections)}
            saveSettings={(connections, selectedConnection, persist) =>
              this.saveSettings(connections, selectedConnection, persist)}
          />
        ) : (
          <Popup
            selectedConnection={this.state.selectedConnection}
            connections={this.state.connections}
            saveSelectedConnection={(selectedConnection, persist) =>
              this.saveSelectedConnection(selectedConnection, persist)}
          />
        )}
      </div>
    );
  }
}

App.propTypes = {
  page: PropTypes.string
};

export default App;
