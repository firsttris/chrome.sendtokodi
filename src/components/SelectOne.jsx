import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SelectOne extends Component {
  handleInputChange(event) {
    const index = event.target.selectedIndex;
    let selectedConnection = { ...this.props.connections[index] };
    this.props.saveSelectedConnection(selectedConnection);
  }

  render() {
    return (
      <div>
        {this.props.showLabel ? (
          <label htmlFor="connections">Select Connection</label>
        ) : (
          ''
        )}
        <select
          className="form-control"
          id="connections"
          onChange={e => this.handleInputChange(e)}
          value={this.props.selectedConnection.name}
        >
          {this.props.connections.map((connection, index) => (
            <option key={index} value={connection.name}>
              {connection.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

SelectOne.propTypes = {
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
  ),
  showLabel: PropTypes.bool
};

export default SelectOne;
