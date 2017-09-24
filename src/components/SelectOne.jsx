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
      <div className="form-group">
        <label htmlFor="connections">Select Connection</label>
        <select
          className="form-control"
          id="connections"
          onChange={e => this.handleInputChange(e)}
        >
          {this.props.connections.map((connection, index) => (
            <option key={index}>{connection.name}</option>
          ))}
        </select>
      </div>
    );
  }
}

SelectOne.propTypes = {
  saveSelectedConnection: PropTypes.func,
  connections: PropTypes.array
};

export default SelectOne;
