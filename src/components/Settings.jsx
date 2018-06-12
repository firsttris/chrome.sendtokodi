import React, { Component } from 'react';
import From from './Form.jsx';
import SelectOne from './SelectOne.jsx';
import PropTypes from 'prop-types';
const newConnection = {
  name: 'Default',
  ip: '',
  port: '',
  login: '',
  pw: ''
};

class Settings extends Component {
  saveForm() {
    let connections = [...this.props.connections];
    const selectedConnection = this.props.selectedConnection;
    const index = connections.findIndex(connection => connection.id === selectedConnection.id);
    connections[index] = selectedConnection;
    this.props.saveSettings(connections, selectedConnection, true);
  }

  create() {
    let connections = [...this.props.connections];
    newConnection.id = new Date();
    connections.unshift(newConnection);
    this.props.saveSettings(connections, newConnection, false);
  }

  delete() {
    let connections = [...this.props.connections];
    let selectedConnection = this.props.selectedConnection;
    if (connections.length < 2) {
      connections = [newConnection];
      selectedConnection = newConnection;
    } else {
      const index = connections.findIndex(connection => connection.id === selectedConnection.id);
      connections.splice(index, 1);
      selectedConnection = connections[0];
    }
    this.props.saveSettings(connections, selectedConnection, true);
  }

  render() {
    return (
      <div className="container mt-3" style={{ width: '500px' }}>
        <div className="form-group">
          <SelectOne
            connections={this.props.connections}
            selectedConnection={this.props.selectedConnection}
            saveSelectedConnection={selectedConnection =>
              this.props.saveSelectedConnection(selectedConnection, true)
            }
          />
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
          selectedConnection={this.props.selectedConnection}
          saveSelectedConnection={selectedConnection =>
            this.props.saveSelectedConnection(selectedConnection, false)
          }
          saveForm={() => this.saveForm()}
        />
      </div>
    );
  }
}

Settings.propTypes = {
  saveSelectedConnection: PropTypes.func,
  saveConnections: PropTypes.func,
  saveSettings: PropTypes.func,
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

export default Settings;
