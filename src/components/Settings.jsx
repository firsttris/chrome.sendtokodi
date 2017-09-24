import React, { Component } from 'react';
import From from './Form.jsx';
const newConnection = {
  name: 'Default',
  ip: '',
  port: '',
  login: '',
  pw: ''
};

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      connections: [newConnection],
      selectedConnection: newConnection
    };
  }

  componentWillMount() {
    chrome.storage.sync.get('settings', result => {
      if (Object.values(result).length) {
        const connections = result.settings.connections;
        const selectedConnection = result.settings.selectedConnection;
        this.setState({
          connections,
          selectedConnection
        });
      }
    });
  }

  selectConnection(event) {
    const index = event.target.selectedIndex;
    let selectedConnection = { ...this.state.connections[index] };
    this.setState({ selectedConnection });
  }

  handleInputChange(event) {
    let selectedConnection = { ...this.state.selectedConnection };
    selectedConnection[event.target.name] = event.target.value;
    this.setState({ selectedConnection });
  }

  save() {
    let connections = [...this.state.connections];
    const selectedConnection = this.state.selectedConnection;
    const index = connections.findIndex(
      connection => connection.id === selectedConnection.id
    );
    connections[index] = selectedConnection;
    this.setState({ connections });
    this.saveToStorage(connections, selectedConnection);
  }

  create() {
    let connections = [...this.state.connections];
    newConnection.id = new Date();
    connections.unshift(newConnection);
    this.setState({
      connections,
      selectedConnection: newConnection
    });
  }

  delete() {
    let connections = [...this.state.connections];
    let selectedConnection = this.state.selectedConnection;
    if (connections.length < 2) {
      connections = [newConnection];
      selectedConnection = newConnection;
    } else {
      const index = connections.findIndex(
        connection => connection.id === selectedConnection.id
      );
      connections.splice(index, 1);
      selectedConnection = connections[0];
    }
    this.setState({ connections, selectedConnection });
    this.saveToStorage(connections, selectedConnection);
  }

  saveToStorage(connections, selectedConnection) {
    const settings = { connections, selectedConnection };
    chrome.storage.sync.set({ settings });
  }

  render() {
    return (
      <div className="container mt-3" style={{ width: '500px' }}>
        <div className="form-group">
          <label htmlFor="connections">Select Connection</label>
          <select
            className="form-control"
            id="connections"
            onChange={e => this.selectConnection(e)}
          >
            {this.state.connections.map((connection, index) => (
              <option key={index}>{connection.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <button className="btn btn-secondary" onClick={() => this.create()}>
            New
          </button>{' '}
          <button className="btn btn-secondary" onClick={() => this.delete()}>
            Delete
          </button>
        </div>
        <From
          selectedConnection={this.state.selectedConnection}
          handleInputChange={e => this.handleInputChange(e)}
          save={() => this.save()}
        />
      </div>
    );
  }
}

export default Settings;
