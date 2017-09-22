import React, { Component } from 'react';

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      link: ''
    };
  }

  handleChange(event) {
    this.setState({ link: event.target.value });
  }

  componentWillMount() {}

  render() {
    return (
      <div className="container mt-3" style={{ width: '500px' }}>
        <div className="form-group">
          <label htmlFor="ipadress">IP Adresse</label>
          <input
            className="form-control"
            type="text"
            placeholder="127.0.0.1"
            id="ipadress"
          />
        </div>
        <div className="form-group">
          <label htmlFor="port">Port</label>
          <input
            className="form-control"
            type="text"
            placeholder="8080"
            id="port"
          />
        </div>
        <div className="form-group">
          <label htmlFor="login">Login</label>
          <input
            className="form-control"
            type="text"
            placeholder="kodi"
            id="login"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className="form-control"
            type="password"
            placeholder="kodi"
            id="password"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-secondary">
            Save
          </button>{' '}
          <button type="submit" className="btn btn-secondary">
            Test
          </button>
        </div>
      </div>
    );
  }
}

export default Settings;
